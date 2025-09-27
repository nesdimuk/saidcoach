import { NextResponse } from 'next/server';
import CircuitGenerator from '../../../lib/circuit-generator';

const generator = new CircuitGenerator();

export async function POST(request) {
  try {
    const { originalExercise, circuitIndex, exerciseIndex, reason, userPreferences } = await request.json();
    
    if (!originalExercise || circuitIndex === undefined || exerciseIndex === undefined) {
      return NextResponse.json(
        { error: 'Datos del ejercicio requeridos' },
        { status: 400 }
      );
    }

    const substitute = await generator.substituteCircuitExercise(
      originalExercise, 
      circuitIndex, 
      exerciseIndex, 
      reason, 
      userPreferences
    );
    
    return NextResponse.json({ success: true, substitute });

  } catch (error) {
    console.error('Error en substitute-circuit-exercise:', error);
    return NextResponse.json(
      { error: error.message || 'Error sustituyendo ejercicio del circuito' },
      { status: 500 }
    );
  }
}