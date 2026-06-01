import { describe, it, expect } from "vitest";
import { parseFinnhubQuote, parseJolpicaLastRace, parseJolpicaStandingsLeader } from "./parse-feeds.mjs";

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
});
