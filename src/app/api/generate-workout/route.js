import { NextResponse } from 'next/server';
import WorkoutGenerator from '../../../lib/workout-generator';

const generator = new WorkoutGenerator();

export async function POST(request) {
  try {
    const userPreferences = await request.json();
    
    // Validar datos requeridos
    if (!userPreferences.duration || !userPreferences.difficulty) {
      return NextResponse.json(
        { error: 'Duración y nivel de dificultad son requeridos' },
        { status: 400 }
      );
    }

    const workout = await generator.generateIntelligentWorkout(userPreferences);
    
    return NextResponse.json({ success: true, workout });

  } catch (error) {
    console.error('Error en generate-workout:', error);
    return NextResponse.json(
      { error: error.message || 'Error generando entrenamiento' },
      { status: 500 }
    );
  }
}