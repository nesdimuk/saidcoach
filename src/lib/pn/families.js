// Normalizador simple
const norm = s => (s || '').toString().toLowerCase()
  .normalize('NFD').replace(/\p{Diacritic}/gu, '');

export const FAMILIES = [
  // === PROTEÍNAS ===
  { name: 'Proteína (verde)', macro:'P', calidad:'verde',
    keywords: ['pollo','pavo','pechuga','merluza','reineta','pescado blanco','marisco','tofu','tempeh'] },
  { name: 'Proteína (amarilla)', macro:'P', calidad:'amarillo',
    keywords: ['huevo','huevos','salmon','atun','yogurt griego','quesillo','ricotta'] },
  { name: 'Proteína (roja)', macro:'P', calidad:'rojo',
    keywords: ['jamon','salame','chorizo','embutido','nugget','vienesa','tocino'] },

  // === CARBOHIDRATOS ===
  { name: 'Carbohidrato (verde)', macro:'C', calidad:'verde',
    keywords: ['fruta','manzana','platano','banana','naranja','pera','uva','kiwi','frutilla','berries','lentejas (como carbo)','porotos (como carbo)','garbanzo (como carbo)'] },
  { name: 'Carbohidrato (amarillo)', macro:'C', calidad:'amarillo',
    keywords: ['pan','marraqueta','hallulla','arroz','pasta','avena','tortilla','arepa','papa','camote','choclo','maiz'] },
  { name: 'Carbohidrato (rojo)', macro:'C', calidad:'rojo',
    keywords: ['azucar','galleta','pastel','kuchen','helado','bebida','soda','refresco','jugo'] },

  // === GRASAS ===
  { name: 'Grasa (verde)', macro:'G', calidad:'verde',
    keywords: ['palta','aguacate','nuez','almendra','mani','cacahuate','semilla','chia','linaza','mantequilla de mani natural'] },
  { name: 'Grasa (amarilla)', macro:'G', calidad:'amarillo',
    keywords: ['aceite','aceite de oliva','mantequilla','mayonesa casera'] },
  { name: 'Grasa (roja)', macro:'G', calidad:'rojo',
    keywords: ['fritura','frito','margarina','salsa cremosa comercial'] },

  // === VERDURAS ===
  { name: 'Verduras (verde)', macro:'V', calidad:'verde',
    keywords: ['ensalada','verdura','lechuga','espinaca','tomate','pepino','zanahoria','brocoli','coliflor','repollo','pimenton'] },

  // === ALCOHOL / COMPUESTOS ===
  { name: 'Alcohol (regular)', macro:'C', calidad:'amarillo',
    keywords: ['vino','cerveza','shot','pisco','whisky','ron','vodka'] },
  { name: 'Cóctel dulce / fuerte', macro:'C', calidad:'rojo',
    keywords: ['margarita','piña colada','daiquiri','gin tonic','ipa','cerveza fuerte','stout'] },
  { name: 'Snack ultraprocesado', macro:'MIX', calidad:'rojo',  // MIX = devolveremos dos piezas
    keywords: ['chips','papas fritas','galletas','snack'] },
];

// Devuelve piezas desde family (MIX = C roja + G roja)
export function familyToPieces(fam){
  if (fam.macro !== 'MIX') return [{ macro: fam.macro, qty: 1, calidad: fam.calidad }];
  return [{ macro:'C', qty:1, calidad:'rojo' }, { macro:'G', qty:1, calidad:'rojo' }];
}

export function matchFamilies(query){
  const q = norm(query);
  const hits = [];
  for (const fam of FAMILIES) {
    const score = fam.keywords.some(k => q.includes(norm(k))) ? 1 : 0;
    if (score) hits.push({ fam, score });
  }
  // orden simple: primero mayor score (aquí 1), luego preferir no-MIX
  return hits.sort((a,b)=> (b.score-a.score) || (a.fam.macro==='MIX' ? 1 : -1));
}
