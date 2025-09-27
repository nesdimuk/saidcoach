const fs = require('fs');

// Leer todos los archivos GIF de la carpeta
const ejerciciosDir = './public/ejercicios';
const gifFiles = fs.readdirSync(ejerciciosDir)
  .filter(file => file.endsWith('.gif'))
  .sort();

console.log(`📁 Analizando ${gifFiles.length} ejercicios para progresiones y regresiones...`);

// Base de conocimiento de ejercicios como entrenador experto
const progressionsDatabase = {
  // Push Ups (Flexiones)
  'PushUpApoyoRodillas.gif': {
    regresion: 'PlanchaRodillasApoyadas.gif',
    progresion: 'PushUps.gif'
  },
  'PushUps.gif': {
    regresion: 'PushUpApoyoRodillas.gif',
    progresion: 'PushUpPiesElevados.gif'
  },
  'PushUpManosElevadas.gif': {
    regresion: 'PushUpApoyoRodillas.gif',
    progresion: 'PushUps.gif'
  },
  'PushUpPiesElevados.gif': {
    regresion: 'PushUps.gif',
    progresion: 'Flexiones con palmada (avanzado)'
  },
  'PushUpExcéntrico.gif': {
    regresion: 'PushUpApoyoRodillas.gif',
    progresion: 'PushUps.gif'
  },

  // Sentadillas
  'SentadillaDesdeCajon.gif': {
    regresion: 'Sentadilla asistida con silla',
    progresion: 'Sentadilla.gif'
  },
  'Sentadilla.gif': {
    regresion: 'SentadillaDesdeCajon.gif',
    progresion: 'SentadillaConSalto.gif'
  },
  'SentadillaConSalto.gif': {
    regresion: 'Sentadilla.gif',
    progresion: 'Salto en cajón'
  },
  'SentadillaIsométrica.gif': {
    regresion: 'SentadillaDesdeCajon.gif',
    progresion: 'Sentadilla.gif'
  },
  'SentadillaFrontalMancuernas.gif': {
    regresion: 'Sentadilla.gif',
    progresion: 'GobletSquat.gif'
  },
  'SentadillaIsometricaMancuernas.gif': {
    regresion: 'SentadillaIsométrica.gif',
    progresion: 'SentadillaFrontalMancuernas.gif'
  },

  // Planchas
  'PlanchaRodillasApoyadas.gif': {
    regresion: 'Plancha inclinada pared',
    progresion: 'Plancha completa'
  },
  'PlanchaPushUp.gif': {
    regresion: 'PlanchaRodillasApoyadas.gif',
    progresion: 'Plancha con palmada'
  },
  'PlanchaAlternandoBrazos.gif': {
    regresion: 'PlanchaRodillasApoyadas.gif',
    progresion: 'ToqueHombros.gif'
  },

  // Estocadas
  'EstocadaAtrásUnilateral.gif': {
    regresion: 'Estocada estática con apoyo',
    progresion: 'EstocadaCaminando.gif'
  },
  'EstocadaCaminando.gif': {
    regresion: 'EstocadaAtrásUnilateral.gif',
    progresion: 'Estocada con salto'
  },
  'EstocadaIsométrica1.gif': {
    regresion: 'Estocada asistida con silla',
    progresion: 'EstocadaAtrásUnilateral.gif'
  },
  'EstocadaSplitUnilateral.gif': {
    regresion: 'EstocadaIsométrica1.gif',
    progresion: 'Estocada búlgara'
  },

  // Puentes
  'PuenteSupino.gif': {
    regresion: 'Puente con pies apoyados en suelo',
    progresion: 'PuenteSupinoPiesElevados.gif'
  },
  'PuenteSupinoPiesElevados.gif': {
    regresion: 'PuenteSupino.gif',
    progresion: 'Puente unilateral'
  },
  'PuenteSupinoConMancuerna.gif': {
    regresion: 'PuenteSupino.gif',
    progresion: 'Hip thrust con barra'
  },

  // Abdominales
  'AbCrunch.gif': {
    regresion: 'Crunch asistido',
    progresion: 'AbCompleto.gif'
  },
  'AbCompleto.gif': {
    regresion: 'AbCrunch.gif',
    progresion: 'V-ups'
  },

  // Burpees
  'BurpeeL1(bajoimpacto).gif': {
    regresion: 'Squat thrust sin salto',
    progresion: 'BurpeeL2gif.gif'
  },
  'BurpeeL2gif.gif': {
    regresion: 'BurpeeL1(bajoimpacto).gif',
    progresion: 'BurpeeL3.gif'
  },
  'BurpeeL3.gif': {
    regresion: 'BurpeeL2gif.gif',
    progresion: 'BurpeeL4.gif'
  },

  // Escaladores
  'EscaladoresLentos.gif': {
    regresion: 'Escaladores desde rodillas',
    progresion: 'Escaladores.gif'
  },
  'Escaladores.gif': {
    regresion: 'EscaladoresLentos.gif',
    progresion: 'Escaladores cruzados'
  },

  // Ejercicios con mancuernas
  'BicepsMancuernasAlternado.gif': {
    regresion: 'Curl de bíceps sentado',
    progresion: 'Curl de bíceps con peso mayor'
  },
  'PesoMuertoMancuernas.gif': {
    regresion: 'Peso muerto con peso corporal',
    progresion: 'PesoMuertoMancuernasUnilateral.gif'
  },
  'PesoMuertoMancuernasUnilateral.gif': {
    regresion: 'PesoMuertoMancuernas.gif',
    progresion: 'PesoMuertoMancuernasUnilateral+Remo.gif'
  }
};

// Función para determinar el tipo basándose en el nombre del archivo
function determinarTipo(nombreArchivo) {
  const nombre = nombreArchivo.replace('.gif', '');
  if (nombre.endsWith('1')) return 'unilateral';
  if (nombre.endsWith('2') || nombre.includes('Alternada') || nombre.includes('Alt')) return 'alternado';
  return 'bilateral';
}

// Función para determinar grupo muscular
function determinarGrupoMuscular(nombreArchivo) {
  const nombre = nombreArchivo.toLowerCase();
  const grupos = [];
  
  if (nombre.includes('ab') || nombre.includes('crunch') || nombre.includes('plancha') || 
      nombre.includes('escalador') || nombre.includes('bichomuerto') || nombre.includes('core') ||
      nombre.includes('puente') && nombre.includes('lateral')) {
    grupos.push('core', 'abdominales');
  }
  
  if (nombre.includes('sentadilla') || nombre.includes('estocada') || nombre.includes('squat') ||
      nombre.includes('lunge') || nombre.includes('subida') || nombre.includes('peso') && nombre.includes('muerto')) {
    grupos.push('piernas');
  }
  
  if (nombre.includes('gluteo') || nombre.includes('puente') || nombre.includes('frog') ||
      nombre.includes('estocada') || nombre.includes('sentadilla') || nombre.includes('peso') && nombre.includes('muerto')) {
    grupos.push('gluteos');
  }
  
  if (nombre.includes('push') || nombre.includes('fondo') || nombre.includes('tricep') ||
      nombre.includes('bicep') || nombre.includes('remo') || nombre.includes('press')) {
    grupos.push('brazos');
  }
  
  if (nombre.includes('push') && nombre.includes('up')) {
    grupos.push('pecho');
  }
  
  if (nombre.includes('remo') || nombre.includes('nadador') || nombre.includes('apertura') ||
      nombre.includes('peso') && nombre.includes('muerto') || nombre.includes('wall') && nombre.includes('slide')) {
    grupos.push('espalda');
  }
  
  if (nombre.includes('apertura') || nombre.includes('wall') || nombre.includes('push') ||
      nombre.includes('plancha') || nombre.includes('hombro') || nombre.includes('press') ||
      nombre.includes('vuelo')) {
    grupos.push('hombros');
  }
  
  if (nombre.includes('burpee') || nombre.includes('jumping') || nombre.includes('escalador') ||
      nombre.includes('skipping') || nombre.includes('salto') || nombre.includes('cardio')) {
    grupos.push('cardio');
  }
  
  if (nombre.includes('burpee') || nombre.includes('jumping')) {
    grupos.push('cuerpo_completo');
  }
  
  if (grupos.length === 0) grupos.push('general');
  
  return [...new Set(grupos)];
}

// Función para determinar implemento
function determinarImplemento(nombreArchivo) {
  const nombre = nombreArchivo.toLowerCase();
  if (nombre.includes('mancuerna')) return 'mancuernas';
  if (nombre.includes('silla')) return 'silla';
  if (nombre.includes('banco') || nombre.includes('cajon')) return 'banco';
  if (nombre.includes('pared') || nombre.includes('wall')) return 'pared';
  return 'peso_corporal';
}

// Función para determinar dificultad
function determinarDificultad(nombreArchivo, tipo) {
  const nombre = nombreArchivo.toLowerCase();
  if (nombre.includes('adaptado') || nombre.includes('rodilla') || nombre.includes('soft') || 
      nombre.includes('apoyo') || nombre.includes('principiante')) {
    return 'principiante';
  }
  if (nombre.includes('avanzado') || nombre.includes('salto') || nombre.includes('burpee') ||
      tipo === 'unilateral' && nombre.includes('remo')) {
    return 'avanzado';
  }
  return 'intermedio';
}

// Función para limpiar nombre
function limpiarNombre(nombreArchivo) {
  return nombreArchivo
    .replace('.gif', '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\s+/, '')
    .replace(/\s+/g, ' ')
    .replace(/([0-9]+)/g, ' $1')
    .replace(/\+/g, ' + ')
    .replace(/:/g, ': ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Función para buscar progresión/regresión
function encontrarProgresionRegresion(archivo, dificultad, grupos, implemento) {
  // Buscar en la base de datos específica
  if (progressionsDatabase[archivo]) {
    const prog = progressionsDatabase[archivo];
    return {
      regresion: prog.regresion.endsWith('.gif') && gifFiles.includes(prog.regresion) ? 
        limpiarNombre(prog.regresion) : prog.regresion,
      progresion: prog.progresion.endsWith('.gif') && gifFiles.includes(prog.progresion) ? 
        limpiarNombre(prog.progresion) : prog.progresion
    };
  }

  // Lógica inteligente basada en características del ejercicio
  const nombre = archivo.toLowerCase();
  let regresion = '';
  let progresion = '';

  // Para ejercicios con rodillas apoyadas
  if (nombre.includes('rodillas') && nombre.includes('apoyadas')) {
    regresion = 'Versión con más apoyo o inclinada';
    progresion = 'Versión completa sin apoyo en rodillas';
  }
  // Para ejercicios con salto
  else if (nombre.includes('salto')) {
    regresion = 'Versión sin salto';
    progresion = 'Versión con salto más alto o doble';
  }
  // Para ejercicios isométricos
  else if (nombre.includes('isometric')) {
    regresion = 'Mantener menos tiempo';
    progresion = 'Versión dinámica del mismo ejercicio';
  }
  // Para ejercicios unilaterales
  else if (archivo.includes('Unilateral') || archivo.endsWith('1.gif')) {
    regresion = 'Versión bilateral del mismo ejercicio';
    progresion = 'Agregar peso o resistencia';
  }
  // Para ejercicios con mancuernas
  else if (implemento === 'mancuernas') {
    regresion = 'Versión con peso corporal';
    progresion = 'Mayor peso o movimiento más complejo';
  }
  // Para ejercicios básicos de peso corporal
  else if (dificultad === 'principiante') {
    regresion = 'Versión asistida o con apoyo';
    progresion = 'Versión estándar';
  }
  // Para ejercicios avanzados
  else if (dificultad === 'avanzado') {
    regresion = 'Versión intermedia';
    progresion = 'Agregar peso o complejidad';
  }
  // Fallback general
  else {
    regresion = 'Versión más simple o con apoyo';
    progresion = 'Versión más desafiante';
  }

  return { regresion, progresion };
}

// Generar CSV con progresiones
let csvContent = 'nombre,grupoMuscular,tipo,implemento,dificultad,archivoGif,descripcion,regresion,progresion\n';

const stats = { bilateral: 0, unilateral: 0, alternado: 0 };

gifFiles.forEach(archivo => {
  const tipo = determinarTipo(archivo);
  const grupoMuscular = determinarGrupoMuscular(archivo);
  const implemento = determinarImplemento(archivo);
  const dificultad = determinarDificultad(archivo, tipo);
  const nombre = limpiarNombre(archivo);
  const { regresion, progresion } = encontrarProgresionRegresion(archivo, dificultad, grupoMuscular, implemento);
  
  stats[tipo]++;
  
  const escapedNombre = `"${nombre.replace(/"/g, '""')}"`;
  const escapedGrupo = `"${grupoMuscular.join(';').replace(/"/g, '""')}"`;
  const descripcion = `"Ejercicio ${tipo} de ${grupoMuscular.join(' y ')}"`;
  const escapedRegresion = `"${regresion.replace(/"/g, '""')}"`;
  const escapedProgresion = `"${progresion.replace(/"/g, '""')}"`;
  
  csvContent += `${escapedNombre},${escapedGrupo},${tipo},${implemento},${dificultad},${archivo},${descripcion},${escapedRegresion},${escapedProgresion}\n`;
});

fs.writeFileSync('./ejercicios-para-airtable.csv', csvContent);

console.log('\n✅ Archivo CSV creado con progresiones: ejercicios-para-airtable.csv');
console.log('\n📊 Estadísticas:');
console.log('- Bilaterales:', stats.bilateral);
console.log('- Unilaterales:', stats.unilateral);
console.log('- Alternados:', stats.alternado);
console.log('- Total:', gifFiles.length);

console.log('\n🎯 Ejemplos de progresiones creadas:');
console.log('\nPush Ups:');
console.log('  - Regresión: Push Up Apoyo Rodillas → Push Ups → Push Up Pies Elevados');
console.log('\nSentadillas:');
console.log('  - Regresión: Sentadilla Desde Cajón → Sentadilla → Sentadilla Con Salto');
console.log('\n✨ ¡Listo para importar a Airtable con progresiones y regresiones!');