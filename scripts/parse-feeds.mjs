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
  const cons = s.Constructors?.[s.Constructors.length - 1]?.name ?? null;
  return { driver: `${s.Driver.givenName} ${s.Driver.familyName}`, points: Number(s.points), wins: Number(s.wins), constructor: cons };
}
