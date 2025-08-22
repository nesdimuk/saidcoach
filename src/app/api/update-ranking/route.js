import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const RESPUESTAS_DIR = path.join(process.cwd(), 'src/app/occim/respuestas ');

export async function POST() {
  try {
    console.log('🔄 Iniciando actualización del ranking...');
    
    // Verificar si existe el directorio de respuestas
    if (!fs.existsSync(RESPUESTAS_DIR)) {
      console.log('📁 Directorio de respuestas no encontrado, usando datos estáticos');
      return NextResponse.json(getStaticData());
    }
    
    // Leer todos los archivos CSV de la carpeta respuestas (solo lecciones)
    const files = fs.readdirSync(RESPUESTAS_DIR)
      .filter(file => file.endsWith('.csv'))
      .filter(file => file.includes('Lección')) // Solo archivos de lecciones
      .map(file => path.join(RESPUESTAS_DIR, file));
    
    console.log(`📁 Encontrados ${files.length} archivos CSV`);
    
    if (files.length === 0) {
      console.log('📊 No hay archivos CSV, usando datos estáticos');
      return NextResponse.json(getStaticData());
    }
    
    const participantScores = {};
    
    // Procesar cada archivo CSV
    for (const file of files) {
      console.log(`📊 Procesando: ${path.basename(file)}`);
      
      try {
        const fileContent = fs.readFileSync(file, 'utf-8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          delimiter: ','
        });
        
        const lessonName = getLessonName(path.basename(file));
        
        records.forEach(row => {
          // Extraer nombre completo
          const firstName = row['Nombre'] || '';
          const lastName = row['Primer Apellido'] || '';
          const rawFullName = `${firstName} ${lastName}`.trim();
          
          if (rawFullName && rawFullName !== '') {
            // Normalizar el nombre para comparación
            const normalizedName = normalizeName(rawFullName);
            
            // Buscar si ya existe este participante (normalizado)
            let canonicalName = null;
            for (const existingName of Object.keys(participantScores)) {
              if (normalizeName(existingName) === normalizedName) {
                canonicalName = existingName;
                break;
              }
            }
            
            // Si no existe, usar el nombre actual como canónico
            if (!canonicalName) {
              canonicalName = rawFullName;
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
            
            // Obtener puntuación
            const score = parseScore(row['Puntuación'] || row['Puntaje'] || '0');
            
            // Evitar duplicados de la misma lección
            const lessonKey = `${lessonName}-${row['Marca temporal']}`;
            if (!participantScores[canonicalName].responses.includes(lessonKey)) {
              participantScores[canonicalName].points += score;
              participantScores[canonicalName].lessons.push(lessonName);
              participantScores[canonicalName].responses.push(lessonKey);
            }
          }
        });
      } catch (fileError) {
        console.error(`❌ Error procesando archivo ${file}:`, fileError);
      }
    }
    
    // Convertir a array y ordenar por puntos
    const ranking = Object.values(participantScores)
      .sort((a, b) => b.points - a.points)
      .map((participant, index) => ({
        name: participant.name,
        points: participant.points,
        lessons: [...new Set(participant.lessons)], // Eliminar duplicados
        avatar: getAvatar(index),
        position: index + 1
      }));
    
    const rankingData = {
      lastUpdate: new Date().toISOString(),
      participants: ranking,
      totalParticipants: ranking.length,
      totalPoints: ranking.reduce((sum, p) => sum + p.points, 0),
      averagePoints: ranking.length > 0 ? Math.round(ranking.reduce((sum, p) => sum + p.points, 0) / ranking.length) : 0
    };
    
    console.log('✅ Ranking actualizado exitosamente');
    console.log(`📈 Total participantes: ${rankingData.totalParticipants}`);
    console.log(`🏆 Líder actual: ${ranking[0]?.name} (${ranking[0]?.points} puntos)`);
    
    return NextResponse.json(rankingData);
    
  } catch (error) {
    console.error('❌ Error actualizando ranking:', error);
    return NextResponse.json(getStaticData());
  }
}

// Función auxiliar para datos estáticos como fallback
function getStaticData() {
  const staticParticipants = [
    { name: "Ana María Guzmán", points: 40, lessons: ["Lección 6", "Lección 7"], avatar: "🏆" },
    { name: "Pablo Gómez", points: 40, lessons: ["Lección 6", "Lección 7"], avatar: "🥈" },
    { name: "Daniel Hevia", points: 40, lessons: ["Lección 6", "Lección 7"], avatar: "🥉" },
    { name: "María Teresa Mesa", points: 20, lessons: ["Lección 6"], avatar: "💪" },
    { name: "Juan Pablo Valle", points: 20, lessons: ["Lección 6"], avatar: "⭐" },
    { name: "Erwin Rivera", points: 20, lessons: ["Lección 6"], avatar: "🌟" },
    { name: "Luis López", points: 20, lessons: ["Lección 6"], avatar: "💫" },
    { name: "Natalia Araya", points: 20, lessons: ["Lección 6"], avatar: "🎯" }
  ];
  
  return {
    lastUpdate: new Date().toISOString(),
    participants: staticParticipants,
    totalParticipants: staticParticipants.length,
    totalPoints: staticParticipants.reduce((sum, p) => sum + p.points, 0),
    averagePoints: Math.round(staticParticipants.reduce((sum, p) => sum + p.points, 0) / staticParticipants.length)
  };
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

// Función auxiliar para normalizar nombres
function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Descomponer caracteres con tildes
    .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes y acentos
    .replace(/[^\w\s]/g, '') // Eliminar puntuación
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .trim(); // Eliminar espacios al inicio y final
}

// Función auxiliar para obtener nombre canónico (versión más completa/reciente)
function getCanonicalName(normalizedName, existingNames) {
  // Buscar si ya existe una versión de este nombre
  for (const existing of existingNames) {
    if (normalizeName(existing) === normalizedName) {
      return existing;
    }
  }
  return null;
}

// Función auxiliar para asignar avatar según posición
function getAvatar(index) {
  const avatars = ["🏆", "🥈", "🥉", "💪", "⭐", "🌟", "💫", "🎯", "🚀", "✨"];
  return avatars[index] || "👤";
}