import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Configuración de autenticación
export const AUTH_CONFIG = {
  SESSION_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 días en millisegundos
  SALT_ROUNDS: 12,
  TOKEN_LENGTH: 32,
};

// Utilidades para hash de contraseñas
export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = async (password, hashedPassword) => {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

// Generar token seguro
export const generateSecureToken = () => {
  return crypto.randomBytes(AUTH_CONFIG.TOKEN_LENGTH).toString('hex');
};

// Crear sesión de usuario
export const createUserSession = async (userId) => {
  try {
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + AUTH_CONFIG.SESSION_DURATION);
    
    const session = await prisma.userSession.create({
      data: {
        userId,
        token,
        expiresAt,
      },
      include: {
        user: {
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
          }
        }
      }
    });
    
    return session;
  } catch (error) {
    console.error('Error creando sesión:', error);
    return null;
  }
};

// Verificar sesión actual
export const verifySession = async (token) => {
  try {
    if (!token) return null;
    
    const session = await prisma.userSession.findUnique({
      where: { token },
      include: {
        user: {
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
          }
        }
      }
    });
    
    if (!session) return null;
    
    // Verificar que la sesión no haya expirado
    if (session.expiresAt < new Date()) {
      await prisma.userSession.delete({ where: { id: session.id } });
      return null;
    }
    
    // Verificar que el usuario esté activo
    if (!session.user.isActive) return null;
    
    return session;
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return null;
  }
};

// Obtener usuario actual desde cookies
export const getCurrentUser = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;
    
    if (!token) return null;
    
    const session = await verifySession(token);
    return session?.user || null;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    return null;
  }
};

// Limpiar sesiones expiradas
export const cleanExpiredSessions = async () => {
  try {
    await prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error limpiando sesiones expiradas:', error);
  }
};

// Cerrar sesión
export const destroySession = async (token) => {
  try {
    if (!token) return false;
    
    await prisma.userSession.delete({
      where: { token }
    });
    
    return true;
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    return false;
  }
};

// Cerrar todas las sesiones del usuario
export const destroyAllUserSessions = async (userId) => {
  try {
    await prisma.userSession.deleteMany({
      where: { userId }
    });
    
    return true;
  } catch (error) {
    console.error('Error cerrando todas las sesiones:', error);
    return false;
  }
};

// Verificar permisos según rol
export const hasPermission = (user, requiredRole) => {
  if (!user) return false;
  
  const roleHierarchy = {
    'CLIENT': 1,
    'COACH': 2,
    'ADMIN': 3
  };
  
  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
};

// Verificar membresía activa
export const hasActiveMembership = (user) => {
  if (!user) return false;
  
  // Membresía FREE siempre activa
  if (user.membershipType === 'FREE') return true;
  
  // Para otras membresías, verificar fecha de expiración
  if (!user.membershipExpiresAt) return false;
  
  return new Date(user.membershipExpiresAt) > new Date();
};

// Obtener características de la membresía
export const getMembershipFeatures = (membershipType) => {
  const features = {
    FREE: {
      name: 'Gratuita',
      workoutPlans: 1,
      nutritionPlans: 1,
      progress: true,
      customPlans: false,
      coachAccess: false,
      prioritySupport: false,
    },
    BASIC: {
      name: 'Básica',
      workoutPlans: 5,
      nutritionPlans: 5,
      progress: true,
      customPlans: true,
      coachAccess: false,
      prioritySupport: false,
    },
    PREMIUM: {
      name: 'Premium',
      workoutPlans: -1, // ilimitado
      nutritionPlans: -1, // ilimitado
      progress: true,
      customPlans: true,
      coachAccess: true,
      prioritySupport: true,
    },
    COACH: {
      name: 'Entrenador',
      workoutPlans: -1, // ilimitado
      nutritionPlans: -1, // ilimitado
      progress: true,
      customPlans: true,
      coachAccess: true,
      prioritySupport: true,
      clientManagement: true,
    }
  };
  
  return features[membershipType] || features.FREE;
};