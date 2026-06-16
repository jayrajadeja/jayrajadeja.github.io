export function parseFinnhubQuote(symbol, q) {
  if (!q || !Number.isFinite(q.c) || !Number.isFinite(q.dp)) return null;
  return { symbol, price: Number(q.c.toFixed(2)), changePct: Number(q.dp.toFixed(2)) };
}

export function parseJolpicaLastRace(json) {
  const race = json?.MRData?.RaceTable?.Races?.[0];
  if (!race) return null;
  const w = race.Results?.[0]?.Driver;
  return {
    round: Number(race.round),
    season: race.season,
    name: race.raceName,
    date: race.date,
    winner: w && w.givenName && w.familyName ? `${w.givenName} ${w.familyName}` : null,
  };
}

export function parseJolpicaStandingsLeader(json) {
  const s = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0];
  if (!s || !s.Driver) return null;
  const points = Number(s.points);
  const wins = Number(s.wins);
  if (!Number.isFinite(points) || !Number.isFinite(wins)) return null;
  const cons = s.Constructors?.[s.Constructors.length - 1]?.name ?? null;
  return { driver: `${s.Driver.givenName} ${s.Driver.familyName}`, points, wins, constructor: cons };
}

/** Top-N driver standings; skips entries with missing driver or non-numeric points/wins. */
export function parseJolpicaStandings(json, limit = 5) {
  const list = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
  if (!Array.isArray(list)) return [];
  return list
    .slice(0, limit)
    .map((s, i) => {
      if (!s || !s.Driver) return null;
      const points = Number(s.points);
      const wins = Number(s.wins);
      if (!Number.isFinite(points) || !Number.isFinite(wins)) return null;
      const cons = s.Constructors?.[s.Constructors.length - 1]?.name ?? null;
      return {
        pos: Number(s.position) || i + 1,
        driver: `${s.Driver.givenName} ${s.Driver.familyName}`,
        points,
        wins,
        constructor: cons,
      };
    })
    .filter(Boolean);
}

/** Next/upcoming race for the current season, or null if none (e.g. season over). */
export function parseJolpicaNextRace(json) {
  const race = json?.MRData?.RaceTable?.Races?.[0];
  if (!race || !race.raceName || !race.date) return null;
  const loc = race.Circuit?.Location;
  return {
    round: Number(race.round),
    season: race.season,
    name: race.raceName,
    date: race.date,
    time: race.time ?? null,
    circuit: race.Circuit?.circuitName ?? null,
    locality: loc?.locality ?? null,
    country: loc?.country ?? null,
  };
}
