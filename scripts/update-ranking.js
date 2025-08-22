const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Configuración de rutas
const RESPUESTAS_DIR = path.join(__dirname, '../src/app/occim/respuestas ');
const RANKING_FILE = path.join(__dirname, '../src/app/occim/ranking/ranking-data.json');

// Función para procesar archivos CSV
async function processCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Función principal para actualizar el ranking
async function updateRanking() {
  try {
    console.log('🔄 Iniciando actualización del ranking...');
    
    // Leer todos los archivos CSV de la carpeta respuestas
    const files = fs.readdirSync(RESPUESTAS_DIR)
      .filter(file => file.endsWith('.csv'))
      .map(file => path.join(RESPUESTAS_DIR, file));
    
    console.log(`📁 Encontrados ${files.length} archivos CSV`);
    
    const participantScores = {};
    
    // Procesar cada archivo CSV
    for (const file of files) {
      console.log(`📊 Procesando: ${path.basename(file)}`);
      
      const data = await processCSVFile(file);
      const lessonName = getLessonName(path.basename(file));
      
      data.forEach(row => {
        // Extraer nombre completo
        const firstName = row['Nombre'] || '';
        const lastName = row['Primer Apellido'] || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        if (fullName && fullName !== '') {
          // Inicializar participante si no existe
          if (!participantScores[fullName]) {
            participantScores[fullName] = {
              name: fullName,
              points: 0,
              lessons: [],
              responses: []
            };
          }
          
          // Obtener puntuación
          const score = parseScore(row['Puntuación'] || row['Puntaje'] || '0');
          
          // Evitar duplicados de la misma lección
          const lessonKey = `${lessonName}-${row['Marca temporal']}`;
          if (!participantScores[fullName].responses.includes(lessonKey)) {
            participantScores[fullName].points += score;
            participantScores[fullName].lessons.push(lessonName);
            participantScores[fullName].responses.push(lessonKey);
          }
        }
      });
    }
    
    // Convertir a array y ordenar por puntos
    const ranking = Object.values(participantScores)
      .sort((a, b) => b.points - a.points)
      .map((participant, index) => ({
        ...participant,
        position: index + 1,
        avatar: getAvatar(index),
        responses: undefined // No incluir en el JSON final
      }));
    
    // Guardar datos del ranking
    const rankingData = {
      lastUpdate: new Date().toISOString(),
      participants: ranking,
      totalParticipants: ranking.length,
      totalPoints: ranking.reduce((sum, p) => sum + p.points, 0),
      averagePoints: ranking.length > 0 ? Math.round(ranking.reduce((sum, p) => sum + p.points, 0) / ranking.length) : 0
    };
    
    // Crear directorio si no existe
    const rankingDir = path.dirname(RANKING_FILE);
    if (!fs.existsSync(rankingDir)) {
      fs.mkdirSync(rankingDir, { recursive: true });
    }
    
    // Guardar archivo JSON
    fs.writeFileSync(RANKING_FILE, JSON.stringify(rankingData, null, 2));
    
    console.log('✅ Ranking actualizado exitosamente');
    console.log(`📈 Total participantes: ${rankingData.totalParticipants}`);
    console.log(`🏆 Líder actual: ${ranking[0]?.name} (${ranking[0]?.points} puntos)`);
    
    return rankingData;
    
  } catch (error) {
    console.error('❌ Error actualizando ranking:', error);
    throw error;
  }
}

// Función auxiliar para extraer nombre de lección del archivo
function getLessonName(filename) {
  if (filename.includes('Lección 6')) return 'Lección 6';
  if (filename.includes('Lección 7')) return 'Lección 7';
  if (filename.includes('Registro de Hábito')) return 'Hábito Diario';
  if (filename.includes('Lección')) {
    const match = filename.match(/Lección (\d+)/);
    return match ? `Lección ${match[1]}` : 'Lección';
  }
  return 'Actividad';
}

// Función auxiliar para parsear puntuación
function parseScore(scoreText) {
  if (typeof scoreText === 'string') {
    const match = scoreText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  return parseInt(scoreText) || 0;
}

// Función auxiliar para asignar avatar según posición
function getAvatar(index) {
  const avatars = ["🏆", "🥈", "🥉", "💪", "⭐", "🌟", "💫", "🎯", "🚀", "✨"];
  return avatars[index] || "👤";
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateRanking()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { updateRanking };