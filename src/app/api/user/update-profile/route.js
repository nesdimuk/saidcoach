import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { name, age, weight, height, gender, activityLevel, goal } = await request.json();
    
    console.log('Received data:', { name, age, weight, height, gender, activityLevel, goal });

    // Validaciones
    const updates = {};
    
    if (name !== undefined) updates.name = name;
    if (age !== undefined) updates.age = age ? parseInt(age) : null;
    if (weight !== undefined) updates.weight = weight ? parseFloat(weight) : null;
    if (height !== undefined) updates.height = height ? parseFloat(height) : null;
    if (gender !== undefined) updates.gender = gender || null;
    if (activityLevel !== undefined) updates.activityLevel = activityLevel || null;
    if (goal !== undefined) updates.goal = goal || null;
    
    console.log('Updates object:', updates);

    // Actualizar usuario en la base de datos
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updates,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        membershipType: true,
        membershipExpiresAt: true,
        isVerified: true,
        isActive: true,
        age: true,
        weight: true,
        height: true,
        gender: true,
        activityLevel: true,
        goal: true,
        updatedAt: true
      }
    });
    
    console.log('Updated user from DB:', updatedUser);

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}