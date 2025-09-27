import { NextResponse } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/onboarding',
  '/miembros',
  '/planes',
  '/progreso',
  '/perfil'
];

// Rutas que solo pueden acceder usuarios no autenticados
const authRoutes = [
  '/auth/login',
  '/auth/register'
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session_token')?.value;

  // Verificar rutas protegidas
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !token) {
    // Redirigir a login con la URL de retorno
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirigir usuarios con token que tratan de acceder a páginas de auth
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y API routes
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};