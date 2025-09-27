import { NextResponse } from 'next/server';
import WorkoutGenerator from '../../../lib/workout-generator';

const generator = new WorkoutGenerator();

export async function POST(request) {
  try {
    const { originalExercise, reason, userPreferences } = await request.json();
    
    // Validar datos requeridos
    if (!originalExercise || !reason) {
      return NextResponse.json(
        { error: 'Ejercicio original y razón son requeridos' },
        { status: 400 }
      );
    }

    const substitute = await generator.substituteExercise(originalExercise, reason, userPreferences);
    
    return NextResponse.json({ success: true, substitute });

  } catch (error) {
    console.error('Error en substitute-exercise:', error);
    return NextResponse.json(
      { error: error.message || 'Error sustituyendo ejercicio' },
      { status: 500 }
    );
  }
}