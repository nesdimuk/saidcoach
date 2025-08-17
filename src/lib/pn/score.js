export function scoreDay(sum, targ, qualityList) {
  const cov = k => Math.min(1, (sum[k] || 0) / (targ[k] || 1));
  const COV = (cov('P') + cov('C') + cov('G')) / 3;

  const qPts = qualityList.reduce((a, q) => a + (q === 'verde' ? 1 : q === 'amarillo' ? 0.5 : 0), 0);
  const QUAL = qualityList.length ? (qPts / qualityList.length) : 1;

  const exc = k => Math.max(0, ((sum[k] || 0) - (targ[k] || 0)) / (targ[k] || 1));
  const EXC = (exc('P') + exc('C') + exc('G')) / 3;

  const raw = 100 * (0.6 * COV + 0.4 * QUAL) - 20 * EXC;
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  const color = score >= 90 ? 'gold' : score >= 75 ? 'verde' : score >= 60 ? 'amarillo' : 'rojo';
  return { score, color };
}
