const fs = require('fs');
const path = require('path');

// Leer todos los archivos GIF de la carpeta
const ejerciciosDir = './public/ejercicios';
const gifFiles = fs.readdirSync(ejerciciosDir)
  .filter(file => file.endsWith('.gif'))
  .sort();

console.log(`📁 Encontrados ${gifFiles.length} archivos GIF únicos`);

// Función para determinar el tipo basándose en el nombre del archivo
function determinarTipo(nombreArchivo) {
  // Quitar la extensión .gif
  const nombre = nombreArchivo.replace('.gif', '');
  
  // Ejercicios que terminan con "1" son unilaterales
  if (nombre.endsWith('1')) {
    return 'unilateral';
  }
  // Ejercicios que terminan con "2" o contienen "Alternada/Alt" son alternados
  if (nombre.endsWith('2') || nombre.includes('Alternada') || nombre.includes('Alt')) {
    return 'alternado';
  }
  // El resto son bilaterales
  return 'bilateral';
}

// Función para determinar grupo muscular basándose en el nombre
function determinarGrupoMuscular(nombreArchivo) {
  const nombre = nombreArchivo.toLowerCase();
  const grupos = [];
  
  // Abdominales/Core
  if (nombre.includes('ab') || nombre.includes('crunch') || nombre.includes('plancha') || 
      nombre.includes('escalador') || nombre.includes('bichomuerto') || nombre.includes('core') ||
      nombre.includes('puente') && nombre.includes('lateral')) {
    grupos.push('core');
    grupos.push('abdominales');
  }
  
  // Piernas
  if (nombre.includes('sentadilla') || nombre.includes('estocada') || nombre.includes('squat') ||
      nombre.includes('lunge') || nombre.includes('subida') || nombre.includes('peso') && nombre.includes('muerto')) {
    grupos.push('piernas');
  }
  
  // Glúteos
  if (nombre.includes('gluteo') || nombre.includes('puente') || nombre.includes('frog') ||
      nombre.includes('estocada') || nombre.includes('sentadilla') || nombre.includes('peso') && nombre.includes('muerto')) {
    grupos.push('gluteos');
  }
  
  // Brazos
  if (nombre.includes('push') || nombre.includes('fondo') || nombre.includes('tricep') ||
      nombre.includes('bicep') || nombre.includes('remo') || nombre.includes('press')) {
    grupos.push('brazos');
  }
  
  // Pecho
  if (nombre.includes('push') && nombre.includes('up')) {
    grupos.push('pecho');
  }
  
  // Espalda
  if (nombre.includes('remo') || nombre.includes('nadador') || nombre.includes('apertura') ||
      nombre.includes('peso') && nombre.includes('muerto') || nombre.includes('wall') && nombre.includes('slide')) {
    grupos.push('espalda');
  }
  
  // Hombros
  if (nombre.includes('apertura') || nombre.includes('wall') || nombre.includes('push') ||
      nombre.includes('plancha') || nombre.includes('hombro') || nombre.includes('press') ||
      nombre.includes('vuelo')) {
    grupos.push('hombros');
  }
  
  // Cardio
  if (nombre.includes('burpee') || nombre.includes('jumping') || nombre.includes('escalador') ||
      nombre.includes('skipping') || nombre.includes('salto') || nombre.includes('cardio')) {
    grupos.push('cardio');
  }
  
  // Cuerpo completo
  if (nombre.includes('burpee') || nombre.includes('jumping')) {
    grupos.push('cuerpo_completo');
  }
  
  // Si no se detectó nada específico, asumir general
  if (grupos.length === 0) {
    grupos.push('general');
  }
  
  return [...new Set(grupos)]; // Eliminar duplicados
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

// Función para limpiar nombre para mostrar
function limpiarNombre(nombreArchivo) {
  return nombreArchivo
    .replace('.gif', '')
    .replace(/([A-Z])/g, ' $1') // Agregar espacios antes de mayúsculas
    .replace(/^\s+/, '') // Quitar espacios al inicio
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .replace(/([0-9]+)/g, ' $1') // Espacios antes de números
    .replace(/\+/g, ' + ') // Espacios alrededor de +
    .replace(/:/g, ': ') // Espacios después de :
    .replace(/\s+/g, ' ') // Normalizar espacios otra vez
    .trim();
}

// Generar CSV
let csvContent = 'nombre,grupoMuscular,tipo,implemento,dificultad,archivoGif,descripcion\n';

const stats = { bilateral: 0, unilateral: 0, alternado: 0 };

gifFiles.forEach(archivo => {
  const tipo = determinarTipo(archivo);
  const grupoMuscular = determinarGrupoMuscular(archivo);
  const implemento = determinarImplemento(archivo);
  const dificultad = determinarDificultad(archivo, tipo);
  const nombre = limpiarNombre(archivo);
  
  stats[tipo]++;
  
  // Escapar comillas y crear fila CSV
  const escapedNombre = `"${nombre.replace(/"/g, '""')}"`;
  const escapedGrupo = `"${grupoMuscular.join(';').replace(/"/g, '""')}"`;
  const descripcion = `"Ejercicio ${tipo} de ${grupoMuscular.join(' y ')}"`;
  
  csvContent += `${escapedNombre},${escapedGrupo},${tipo},${implemento},${dificultad},${archivo},${descripcion}\n`;
});

// Guardar archivo CSV
fs.writeFileSync('./ejercicios-para-airtable.csv', csvContent);

console.log('\n✅ Archivo CSV creado: ejercicios-para-airtable.csv');

// Mostrar estadísticas
console.log('\n📊 Estadísticas:');
console.log('- Bilaterales:', stats.bilateral);
console.log('- Unilaterales:', stats.unilateral);
console.log('- Alternados:', stats.alternado);
console.log('- Total:', gifFiles.length);

// Mostrar algunos ejemplos
console.log('\n🔍 Ejemplos de nombres generados:');
console.log('\nUnilaterales:');
gifFiles.filter(archivo => determinarTipo(archivo) === 'unilateral').slice(0, 5).forEach(archivo => {
  const nombre = limpiarNombre(archivo);
  console.log(`  - ${nombre}`);
});

console.log('\nAlternados:');
gifFiles.filter(archivo => determinarTipo(archivo) === 'alternado').slice(0, 5).forEach(archivo => {
  const nombre = limpiarNombre(archivo);
  console.log(`  - ${nombre}`);
});

console.log('\nBilaterales (primeros 5):');
gifFiles.filter(archivo => determinarTipo(archivo) === 'bilateral').slice(0, 5).forEach(archivo => {
  const nombre = limpiarNombre(archivo);
  console.log(`  - ${nombre}`);
});

console.log('\n✨ ¡Listo para importar a Airtable!');