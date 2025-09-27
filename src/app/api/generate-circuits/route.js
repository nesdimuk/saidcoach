import { NextResponse } from 'next/server';
import CircuitGenerator from '../../../lib/circuit-generator';

const generator = new CircuitGenerator();

export async function POST(request) {
  try {
    const userPreferences = await request.json();
    
    const circuits = await generator.generateHIITCircuits(userPreferences);
    
    return NextResponse.json({ success: true, circuits });

  } catch (error) {
    console.error('Error en generate-circuits:', error);
    return NextResponse.json(
      { error: error.message || 'Error generando circuitos HIIT' },
      { status: 500 }
    );
  }
}