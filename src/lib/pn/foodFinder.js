import { lookupFood } from './foodDb';           // tu base generada
import { matchFamilies, familyToPieces } from './families';

// Intenta DB → si vacío, intenta familias → devuelve ítems "sintéticos"
export function lookupAnyFood(q) {
  const db = lookupFood(q);
  if (db && db.length) return db;

  const fams = matchFamilies(q).slice(0, 3); // máximo 3 sugerencias
  return fams.map(({ fam }) => ({
    name: fam.name,
    aliases: [],
    pieces: familyToPieces(fam),
  }));
}
