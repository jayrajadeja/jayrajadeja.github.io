import { describe, it, expect } from "vitest";
import {
  parseFinnhubQuote,
  parseJolpicaLastRace,
  parseJolpicaStandingsLeader,
  parseJolpicaStandings,
  parseJolpicaNextRace,
} from "./parse-feeds.mjs";

describe("parseFinnhubQuote", () => {
  it("normalizes a quote", () => {
    expect(parseFinnhubQuote("NVDA", { c: 123.456, dp: 2.413 })).toEqual({ symbol: "NVDA", price: 123.46, changePct: 2.41 });
  });
  it("returns null on malformed or non-finite input", () => {
    expect(parseFinnhubQuote("NVDA", {})).toBeNull();
    expect(parseFinnhubQuote("NVDA", null)).toBeNull();
    expect(parseFinnhubQuote("NVDA", { c: 100, dp: NaN })).toBeNull();
    expect(parseFinnhubQuote("NVDA", { c: Infinity, dp: 1 })).toBeNull();
  });
});

describe("parseJolpicaLastRace", () => {
  it("extracts race + winner", () => {
    const json = { MRData: { RaceTable: { Races: [{ round: "10", season: "2026", raceName: "British GP", date: "2026-07-05", Results: [{ Driver: { givenName: "Max", familyName: "Verstappen" } }] }] } } };
    expect(parseJolpicaLastRace(json)).toEqual({ round: 10, season: "2026", name: "British GP", date: "2026-07-05", winner: "Max Verstappen" });
  });
  it("returns null when no races", () => {
    expect(parseJolpicaLastRace({ MRData: { RaceTable: { Races: [] } } })).toBeNull();
  });
  it("winner is null when the driver name is incomplete", () => {
    const json = { MRData: { RaceTable: { Races: [{ round: "1", season: "2026", raceName: "X GP", date: "2026-01-01", Results: [{ Driver: { givenName: "Max" } }] }] } } };
    expect(parseJolpicaLastRace(json).winner).toBeNull();
  });
});

describe("parseJolpicaStandingsLeader", () => {
  it("extracts the championship leader", () => {
    const json = { MRData: { StandingsTable: { StandingsLists: [{ DriverStandings: [{ points: "210", wins: "5", Driver: { givenName: "Lando", familyName: "Norris" }, Constructors: [{ name: "McLaren" }] }] }] } } };
    expect(parseJolpicaStandingsLeader(json)).toEqual({ driver: "Lando Norris", points: 210, wins: 5, constructor: "McLaren" });
  });
  it("returns null when empty", () => {
    expect(parseJolpicaStandingsLeader({ MRData: { StandingsTable: { StandingsLists: [] } } })).toBeNull();
  });
  it("returns null when the standings entry has no Driver", () => {
    const json = { MRData: { StandingsTable: { StandingsLists: [{ DriverStandings: [{ points: "10", wins: "0" }] }] } } };
    expect(parseJolpicaStandingsLeader(json)).toBeNull();
  });
  it("returns null when points/wins are missing or non-numeric (avoids 'null pts')", () => {
    const json = { MRData: { StandingsTable: { StandingsLists: [{ DriverStandings: [{ wins: "5", Driver: { givenName: "Lewis", familyName: "Hamilton" } }] }] } } };
    expect(parseJolpicaStandingsLeader(json)).toBeNull();
  });
});

describe("parseJolpicaStandings", () => {
  const json = {
    MRData: {
      StandingsTable: {
        StandingsLists: [
          {
            DriverStandings: [
              { position: "1", points: "210", wins: "5", Driver: { givenName: "Lando", familyName: "Norris" }, Constructors: [{ name: "McLaren" }] },
              { position: "2", points: "180", wins: "3", Driver: { givenName: "Max", familyName: "Verstappen" }, Constructors: [{ name: "Red Bull" }] },
              { position: "3", points: "150", wins: "1", Driver: { givenName: "Lewis", familyName: "Hamilton" }, Constructors: [{ name: "Ferrari" }] },
            ],
          },
        ],
      },
    },
  };

  it("returns the top-N standings in order", () => {
    const out = parseJolpicaStandings(json, 2);
    expect(out).toEqual([
      { pos: 1, driver: "Lando Norris", points: 210, wins: 5, constructor: "McLaren" },
      { pos: 2, driver: "Max Verstappen", points: 180, wins: 3, constructor: "Red Bull" },
    ]);
  });

  it("returns [] when there are no standings", () => {
    expect(parseJolpicaStandings({ MRData: { StandingsTable: { StandingsLists: [] } } })).toEqual([]);
  });

  it("skips malformed entries (no driver / non-numeric points)", () => {
    const bad = { MRData: { StandingsTable: { StandingsLists: [{ DriverStandings: [
      { position: "1", points: "x", wins: "0", Driver: { givenName: "A", familyName: "B" } },
      { position: "2", wins: "1" },
    ] }] } } };
    expect(parseJolpicaStandings(bad)).toEqual([]);
  });
});

describe("parseJolpicaNextRace", () => {
  it("extracts the upcoming race with circuit + location", () => {
    const json = { MRData: { RaceTable: { Races: [{ round: "11", season: "2026", raceName: "Austrian GP", date: "2026-06-29", time: "13:00:00Z", Circuit: { circuitName: "Red Bull Ring", Location: { locality: "Spielberg", country: "Austria" } } }] } } };
    expect(parseJolpicaNextRace(json)).toEqual({
      round: 11, season: "2026", name: "Austrian GP", date: "2026-06-29", time: "13:00:00Z",
      circuit: "Red Bull Ring", locality: "Spielberg", country: "Austria",
    });
  });

  it("returns null when there is no next race (season over)", () => {
    expect(parseJolpicaNextRace({ MRData: { RaceTable: { Races: [] } } })).toBeNull();
  });
});
