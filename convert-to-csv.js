const fs = require('fs');

// Leer el archivo JSON existente
const data = JSON.parse(fs.readFileSync('./src/data/ejercicios.json', 'utf8'));

// Función para determinar el tipo de ejercicio
function determinarTipo(nombre) {
  // Ejercicios que terminan con " 1" son unilaterales
  if (nombre.endsWith(' 1')) {
    return 'unilateral';
  }
  // Ejercicios que terminan con " 2" o contienen "Alternada" son alternados
  if (nombre.endsWith(' 2') || nombre.includes('Alternada') || nombre.includes('Alt ')) {
    return 'alternado';
  }
  // El resto son bilaterales
  return 'bilateral';
}

// Convertir a formato CSV
let csvContent = 'nombre,grupoMuscular,tipo,implemento,dificultad,archivoGif,descripcion\n';

data.ejercicios.forEach(ejercicio => {
  const nombre = ejercicio.nombre;
  const grupoMuscular = ejercicio.grupoMuscular.join(';'); // Separar múltiples grupos con ;
  const tipo = determinarTipo(nombre);
  const implemento = ejercicio.implemento;
  const dificultad = ejercicio.dificultad;
  const archivoGif = ejercicio.archivo;
  const descripcion = ejercicio.descripcion || '';
  
  // Escapar comillas en los campos si las hay
  const escapedNombre = `"${nombre.replace(/"/g, '""')}"`;
  const escapedGrupo = `"${grupoMuscular.replace(/"/g, '""')}"`;
  const escapedDesc = `"${descripcion.replace(/"/g, '""')}"`;
  
  csvContent += `${escapedNombre},${escapedGrupo},${tipo},${implemento},${dificultad},${archivoGif},${escapedDesc}\n`;
});

// Guardar el archivo CSV
fs.writeFileSync('./ejercicios-para-airtable.csv', csvContent);

console.log('✅ Archivo CSV creado: ejercicios-para-airtable.csv');

// Mostrar estadísticas
const stats = {};
data.ejercicios.forEach(ejercicio => {
  const tipo = determinarTipo(ejercicio.nombre);
  stats[tipo] = (stats[tipo] || 0) + 1;
});

console.log('\n📊 Estadísticas:');
console.log('- Bilaterales:', stats.bilateral || 0);
console.log('- Unilaterales:', stats.unilateral || 0); 
console.log('- Alternados:', stats.alternado || 0);
console.log('- Total:', data.ejercicios.length);

// Mostrar ejemplos de cada tipo
console.log('\n🔍 Ejemplos por tipo:');
console.log('\nUnilaterales:');
data.ejercicios.filter(e => determinarTipo(e.nombre) === 'unilateral').slice(0, 5).forEach(e => {
  console.log(`  - ${e.nombre}`);
});

console.log('\nAlternados:');
data.ejercicios.filter(e => determinarTipo(e.nombre) === 'alternado').slice(0, 5).forEach(e => {
  console.log(`  - ${e.nombre}`);
});

console.log('\nBilaterales (primeros 5):');
data.ejercicios.filter(e => determinarTipo(e.nombre) === 'bilateral').slice(0, 5).forEach(e => {
  console.log(`  - ${e.nombre}`);
});