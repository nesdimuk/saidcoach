export function computeTargetsMujer(obj, pref, entrenoHoy) {
  // T = total P+C+G por objetivo
  const T = obj === 'perdida' ? 14 : obj === 'mantenimiento' ? 15 : 16;
  // P anclada
  const P = obj === 'musculo' ? 6 : 5;
  // Verduras del día (rango operativo bajo acordado)
  const V = obj === 'perdida' ? 5 : obj === 'mantenimiento' ? 4 : 3;

  const clamp = (x, min, max) => Math.min(max, Math.max(min, x));

  // Reparto C/G según preferencia dentro de 4–6
  const R = T - P;
  let C = Math.round(R / 2);
  let G = R - C;

  if (pref === 'alto_carbo') C += 1;
  if (pref === 'alto_grasa') G += 1;

  C = clamp(C, 4, 6);
  G = clamp(R - C, 4, 6);

  if (entrenoHoy && C < 6) {
    C = clamp(C + 1, 4, 6);
    G = clamp(R - C, 4, 6);
  }

  return { P, C, G, V };
}
