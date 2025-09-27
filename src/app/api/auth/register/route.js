import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, createUserSession, generateSecureToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar que el email no esté en uso
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Generar token de verificación
    const verificationToken = generateSecureToken();

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
        verificationToken,
        role: 'CLIENT',
        membershipType: 'FREE'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        membershipType: true,
        isVerified: true,
        createdAt: true
      }
    });

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
      message: 'Usuario creado exitosamente',
      user: session.user,
      redirect: '/onboarding' // Redirigir al onboarding para completar perfil
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
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}