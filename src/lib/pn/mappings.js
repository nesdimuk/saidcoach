// src/lib/pn/mappings.js
// Atajos principales por macro y calidad (todas suman +1 porción)
// Política: sin medias porciones (si llegaran fracciones, se redondea a 1 en la UI)

export const quickAdds = {
  // Proteína
  'P verde':    { p:1, c:0, g:0, v:0, calidad:'verde' },
  'P amarilla': { p:1, c:0, g:0, v:0, calidad:'amarillo' },
  'P roja':     { p:1, c:0, g:0, v:0, calidad:'rojo' },

  // Carbohidratos
  'C verde':    { p:0, c:1, g:0, v:0, calidad:'verde' },
  'C amarilla': { p:0, c:1, g:0, v:0, calidad:'amarillo' },
  'C roja':     { p:0, c:1, g:0, v:0, calidad:'rojo' },

  // Grasas
  'G verde':    { p:0, c:0, g:1, v:0, calidad:'verde' },
  'G amarilla': { p:0, c:0, g:1, v:0, calidad:'amarillo' },
  'G roja':     { p:0, c:0, g:1, v:0, calidad:'rojo' },

  // Verduras (verde por defecto)
  '+1V':        { p:0, c:0, g:0, v:1, calidad:'verde' },
};
