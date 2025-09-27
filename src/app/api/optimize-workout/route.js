import { NextResponse } from 'next/server';
import WorkoutGenerator from '../../../lib/workout-generator';

const generator = new WorkoutGenerator();

export async function POST(request) {
  try {
    const { currentWorkout, userFeedback } = await request.json();
    
    // Validar datos requeridos
    if (!currentWorkout || !userFeedback) {
      return NextResponse.json(
        { error: 'Rutina actual y feedback son requeridos' },
        { status: 400 }
      );
    }

    const optimizedWorkout = await generator.optimizeWorkout(currentWorkout, userFeedback);
    
    return NextResponse.json({ success: true, optimizedWorkout });

  } catch (error) {
    console.error('Error en optimize-workout:', error);
    return NextResponse.json(
      { error: error.message || 'Error optimizando rutina' },
      { status: 500 }
    );
  }
}