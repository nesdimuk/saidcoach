import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, createUserSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar que la cuenta esté activa
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Cuenta desactivada. Contacta al soporte.' },
        { status: 403 }
      );
    }

    // Crear sesión
    const session = await createUserSession(user.id);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Error al crear la sesión' },
        { status: 500 }
      );
    }

    // Configurar cookie de sesión
    const response = NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: session.user,
    });

    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 días
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}