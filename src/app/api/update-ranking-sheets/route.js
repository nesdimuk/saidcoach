import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

// Configuración de Google Drive
const DRIVE_FOLDER_ID = '1gCcJiNomfpbvPVtL8uYrjqJpgeBA9Yl2';

// Configurar credenciales (desde archivo local o variables de entorno)
function getCredentials() {
  console.log('🔍 Verificando credenciales...');
  console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
  console.log('🔍 ¿Existe GOOGLE_SERVICE_ACCOUNT_KEY?:', !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  console.log('🔍 ¿Existe GOOGLE_SERVICE_ACCOUNT_BASE64?:', !!process.env.GOOGLE_SERVICE_ACCOUNT_BASE64);
  
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    // Usar Base64 para evitar problemas con caracteres especiales
    console.log('📋 Usando credenciales Base64 de variable de entorno');
    try {
      const base64String = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
      const credentialsString = Buffer.from(base64String, 'base64').toString('utf-8');
      return JSON.parse(credentialsString);
    } catch (parseError) {
      console.error('❌ Error parseando credenciales Base64:', parseError.message);
      throw new Error(`Error en formato de credenciales Base64: ${parseError.message}`);
    }
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    // En producción, usar variable de entorno
    console.log('📋 Usando credenciales de variable de entorno');
    try {
      const credentialsString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      console.log('📋 Longitud de credenciales:', credentialsString.length);
      
      // Limpiar caracteres de escape problemáticos
      const cleanCredentials = credentialsString
        .replace(/\\n/g, '\n')  // Convertir \\n a \n real
        .replace(/\\\\/g, '\\') // Convertir \\\\ a \\ real
        .trim();
        
      return JSON.parse(cleanCredentials);
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError.message);
      throw new Error(`Error en formato de credenciales: ${parseError.message}`);
    }
  } else {
    // En desarrollo, usar archivo local
    console.log('📋 Variable de entorno no encontrada, intentando archivo local');
    const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials', 'saidcoach-occim-ab5036613f0e.json');
    const fs = require('fs');
    
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      throw new Error(`No se encontraron credenciales. Variable de entorno faltante y archivo no existe: ${CREDENTIALS_PATH}`);
    }
    
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  }
}

export async function POST() {
  try {
    console.log('🔄 Iniciando actualización del ranking desde Google Sheets v2...');

    // Autenticar con Google APIs
    const credentials = getCredentials();
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly'
      ]
    });

    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });
    const participantScores = {};

    // Buscar todos los archivos de Google Sheets en la carpeta que contengan "Lección"
    console.log(`📁 Buscando sheets en carpeta: ${DRIVE_FOLDER_ID}`);
    
    const response = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and name contains 'Lección'`,
      fields: 'files(id, name)'
    });

    const sheetFiles = response.data.files || [];
    console.log(`📊 Encontrados ${sheetFiles.length} sheets de lecciones`);

    if (sheetFiles.length === 0) {
      console.log('⚠️ No se encontraron sheets de lecciones en la carpeta');
      return NextResponse.json(getStaticData());
    }

    // Procesar cada Google Sheet encontrado
    for (const file of sheetFiles) {
      const lessonName = extractLessonName(file.name);
      const sheetId = file.id;
      try {
        console.log(`📊 Procesando ${lessonName}: ${sheetId}`);

        // Leer datos del sheet (asumiendo que están en la primera hoja)
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: 'A:Z', // Leer todas las columnas
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
          console.log(`⚠️ No hay datos en ${lessonName}`);
          continue;
        }

        // Primera fila son los headers
        const headers = rows[0];
        const dataRows = rows.slice(1);

        // Encontrar índices de columnas importantes
        const nombreIndex = headers.findIndex(h => h && h.toLowerCase().includes('nombre'));
        const apellidoIndex = headers.findIndex(h => h && h.toLowerCase().includes('apellido'));
        const puntuacionIndex = headers.findIndex(h => h && (h.toLowerCase().includes('puntuación') || h.toLowerCase().includes('puntuacion')));

        if (nombreIndex === -1 || apellidoIndex === -1 || puntuacionIndex === -1) {
          console.log(`⚠️ No se encontraron las columnas necesarias en ${lessonName}`);
          continue;
        }

        // Agrupar respuestas por participante para manejar duplicados
        const participantResponses = {};
        
        dataRows.forEach((row, index) => {
          if (!row || row.length === 0) return;

          const firstName = row[nombreIndex] || '';
          const lastName = row[apellidoIndex] || '';
          const scoreText = row[puntuacionIndex] || '0';
          const timestamp = row[0] || ''; // Primera columna suele ser timestamp
          
          const rawFullName = `${firstName} ${lastName}`.trim();
          
          if (rawFullName && rawFullName !== '') {
            // Normalizar el nombre para comparación
            const normalizedName = normalizeName(rawFullName);
            
            // Inicializar array de respuestas para este participante normalizado
            if (!participantResponses[normalizedName]) {
              participantResponses[normalizedName] = [];
            }
            
            // Agregar esta respuesta
            participantResponses[normalizedName].push({
              rawName: rawFullName,
              score: parseScore(scoreText),
              timestamp: timestamp,
              rowIndex: index
            });
          }
        });

        // Procesar cada participante y usar solo la respuesta más reciente
        console.log(`🔍 ${lessonName}: Encontrados ${Object.keys(participantResponses).length} participantes únicos`);
        
        for (const [normalizedName, responses] of Object.entries(participantResponses)) {
          // Ordenar por timestamp descendente (más reciente primero)
          responses.sort((a, b) => {
            // Si hay timestamps, usarlos; si no, usar índice de fila
            if (a.timestamp && b.timestamp) {
              return new Date(b.timestamp) - new Date(a.timestamp);
            }
            return b.rowIndex - a.rowIndex;
          });
          
          // Tomar solo la respuesta más reciente
          const latestResponse = responses[0];
          
          console.log(`👤 Procesando: ${latestResponse.rawName} (${latestResponse.score} puntos)`);
          
          if (responses.length > 1) {
            console.log(`⚠️ ${latestResponse.rawName} tiene ${responses.length} respuestas en ${lessonName}. Usando la más reciente.`);
          }
          
          // Buscar si ya existe este participante en el scoring global
          let canonicalName = null;
          for (const existingName of Object.keys(participantScores)) {
            if (isSamePerson(existingName, latestResponse.rawName)) {
              canonicalName = existingName;
              break;
            }
          }
          
          // Si no existe, usar el nombre de la respuesta más reciente como canónico
          if (!canonicalName) {
            canonicalName = latestResponse.rawName;
            console.log(`✨ Nuevo participante: ${canonicalName}`);
          }
          
          // Inicializar participante si no existe
          if (!participantScores[canonicalName]) {
            participantScores[canonicalName] = {
              name: canonicalName,
              points: 0,
              lessons: [],
              responses: []
            };
          }
          
          // Verificar si ya procesamos esta lección para este participante
          const responseKey = `${lessonName}`;
          if (!participantScores[canonicalName].responses.includes(responseKey)) {
            participantScores[canonicalName].points += latestResponse.score;
            participantScores[canonicalName].lessons.push(lessonName);
            participantScores[canonicalName].responses.push(responseKey);
            console.log(`✅ ${canonicalName}: +${latestResponse.score} puntos por ${lessonName}`);
          } else {
            console.log(`⏭️ ${canonicalName}: Ya procesada ${lessonName}`);
          }
        }

      } catch (sheetError) {
        console.error(`❌ Error procesando ${lessonName}:`, sheetError.message);
      }
    }

    // Convertir a array y ordenar por puntos
    const sortedParticipants = Object.values(participantScores)
      .sort((a, b) => b.points - a.points);
    
    // Asignar posiciones considerando empates
    const ranking = [];
    let currentPosition = 1;
    
    for (let i = 0; i < sortedParticipants.length; i++) {
      const participant = sortedParticipants[i];
      
      // Si no es el primer participante y tiene diferentes puntos que el anterior
      if (i > 0 && participant.points !== sortedParticipants[i - 1].points) {
        currentPosition = i + 1;
      }
      
      ranking.push({
        name: participant.name,
        points: participant.points,
        lessons: [...new Set(participant.lessons)], // Eliminar duplicados
        avatar: getAvatar(currentPosition - 1),
        position: currentPosition,
        isTied: i > 0 && participant.points === sortedParticipants[i - 1].points ||
                i < sortedParticipants.length - 1 && participant.points === sortedParticipants[i + 1].points
      });
    }

    const rankingData = {
      lastUpdate: new Date().toISOString(),
      participants: ranking,
      totalParticipants: ranking.length,
      totalPoints: ranking.reduce((sum, p) => sum + p.points, 0),
      averagePoints: ranking.length > 0 ? Math.round(ranking.reduce((sum, p) => sum + p.points, 0) / ranking.length) : 0
    };

    console.log('✅ Ranking actualizado exitosamente desde Google Sheets');
    console.log(`📈 Total participantes: ${rankingData.totalParticipants}`);
    console.log(`🏆 Líder actual: ${ranking[0]?.name} (${ranking[0]?.points} puntos)`);

    return NextResponse.json(rankingData);

  } catch (error) {
    console.error('❌ Error actualizando ranking desde Sheets:', error);
    return NextResponse.json(getStaticData(), { status: 500 });
  }
}

// Función auxiliar para extraer nombre de lección del nombre del archivo
function extractLessonName(fileName) {
  // Buscar patrón "Lección X" en el nombre del archivo
  const match = fileName.match(/Lección\s*(\d+)/i);
  if (match) {
    return `Lección ${match[1]}`;
  }
  return fileName;
}

// Función auxiliar para normalizar nombres
function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Función para determinar si dos nombres pertenecen a la misma persona
function isSamePerson(name1, name2) {
  if (!name1 || !name2) return false;
  
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);
  
  // Si son exactamente iguales después de normalizar
  if (normalized1 === normalized2) return true;
  
  // Dividir en palabras
  const words1 = normalized1.split(' ').filter(w => w.length > 0);
  const words2 = normalized2.split(' ').filter(w => w.length > 0);
  
  // Si uno de los nombres está completamente contenido en el otro
  // Por ejemplo: "pablo gomez" está contenido en "pablo gomez gomez saavedra"
  if (words1.length <= words2.length) {
    const isContained = words1.every(word => words2.includes(word));
    if (isContained) return true;
  }
  
  if (words2.length <= words1.length) {
    const isContained = words2.every(word => words1.includes(word));
    if (isContained) return true;
  }
  
  return false;
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

// Función auxiliar para datos estáticos como fallback
function getStaticData() {
  const staticParticipants = [
    { name: "Ana María Guzmán", points: 60, lessons: ["Lección 6", "Lección 7", "Lección 8"], avatar: "🏆" },
    { name: "Pablo Gómez", points: 60, lessons: ["Lección 6", "Lección 7", "Lección 8"], avatar: "🥈" },
    { name: "Daniel Hevia", points: 60, lessons: ["Lección 6", "Lección 7", "Lección 8"], avatar: "🥉" }
  ];
  
  return {
    lastUpdate: new Date().toISOString(),
    participants: staticParticipants,
    totalParticipants: staticParticipants.length,
    totalPoints: staticParticipants.reduce((sum, p) => sum + p.points, 0),
    averagePoints: Math.round(staticParticipants.reduce((sum, p) => sum + p.points, 0) / staticParticipants.length)
  };
}