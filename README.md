# SaidCoach - Plataforma Completa de Coaching

Una plataforma integral de coaching que combina planes nutricionales y de entrenamiento automatizados, con sistema de seguimiento inteligente y adaptación automática.

## 🚀 Características Principales

### ✅ Implementado
- **Sistema de Lecciones Interactivas** con videos y gamificación
- **Calculadora Nutricional PN** avanzada con tracking de macronutrientes
- **Portal de Alumnos** integrado con PT Distinction
- **Formularios de Coaching** y feedback con Google Forms

### 🆕 Nuevas Funcionalidades
- **Generación Automática de Planes Nutricionales** personalizados
- **Creación Automática de Rutinas de Entrenamiento** adaptadas al usuario
- **Dashboard Completo** para visualizar y gestionar planes
- **Sistema de Seguimiento Inteligente** con ajustes automáticos
- **Base de Datos Estructurada** con Prisma + PostgreSQL

## 🏗️ Arquitectura del Sistema

```
src/
├── app/
│   ├── dashboard/           # Dashboard principal del usuario
│   ├── auth/               # Autenticación (próximamente)
│   └── api/                # API routes (próximamente)
├── lib/
│   ├── plan-generator/     # Generadores de planes automáticos
│   │   ├── nutrition.js    # ✅ Planes nutricionales
│   │   ├── workout.js      # ✅ Rutinas de entrenamiento
│   │   └── adaptive.js     # ✅ Sistema de ajustes inteligentes
│   └── pn/                # Sistema PN existente
└── components/            # Componentes reutilizables
```

## 🎯 Generación Automática de Planes

### Planes Nutricionales
- **Personalización completa** basada en edad, peso, altura, género, nivel de actividad y objetivo
- **Distribución inteligente** de macronutrientes a lo largo del día (4 comidas)
- **Variedad automática** usando tu base de datos de alimentos existente
- **Calidad nutricional** con sistema verde/amarillo/rojo
- **Targets adaptativos** que se ajustan según el progreso del usuario

### Rutinas de Entrenamiento
- **Templates por objetivo**: Pérdida de peso, ganancia muscular, mantenimiento
- **Niveles progresivos**: Principiante, intermedio, avanzado
- **Planificación semanal** con distribución inteligente de grupos musculares
- **Ejercicios variados** con instrucciones y notas técnicas
- **Progresión automática** basada en el rendimiento del usuario

## 🧠 Sistema de Adaptación Inteligente

### Análisis Automático
- **Adherencia nutricional**: Tracking de cumplimiento de macros
- **Niveles de energía**: Monitoreo del estado del usuario
- **Completitud de entrenamientos**: Seguimiento de rutinas realizadas
- **Tendencias de progreso**: Análisis de patrones a largo plazo

### Ajustes Dinámicos
- **Simplificación automática** si la adherencia es baja
- **Incremento de intensidad** cuando el usuario está listo
- **Balanceó de macronutrientes** según feedback energético
- **Recomendaciones personalizadas** basadas en datos reales

## 🗄️ Base de Datos

### Modelos Principales
- **User**: Perfil completo del usuario con métricas
- **NutritionPlan/WorkoutPlan**: Planes generados automáticamente
- **Meal/Exercise**: Componentes detallados de cada plan
- **Progress**: Tracking diario de progreso y métricas

### Características
- **Relaciones optimizadas** para consultas eficientes
- **Versionado de planes** para seguimiento histórico
- **Flexibilidad para expansión** futura

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos
```bash
# Copiar variables de entorno
cp .env.example .env

# Configurar PostgreSQL en .env
DATABASE_URL="postgresql://username:password@localhost:5432/saidcoach"

# Generar cliente Prisma
npm run db:generate

# Aplicar esquema a la base de datos
npm run db:push
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

### 4. Probar el sistema
1. Ve a `http://localhost:3000/dashboard`
2. Haz clic en "Generar Planes" para crear planes automáticos
3. Explora las pestañas de Nutrición y Entrenamiento
4. Revisa el sistema de seguimiento en Progreso

## 📱 Uso del Dashboard

### Resumen
- **Métricas clave** del usuario (objetivo, días de entrenamiento, etc.)
- **Plan del día actual** con comidas y entrenamiento
- **Acciones rápidas** para tracking y completar actividades

### Nutrición
- **Objetivos de macronutrientes** visualizados claramente
- **Selector de días** para ver plan semanal completo
- **Detalle de comidas** con ingredientes y cantidades
- **Integración con sistema PN** existente

### Entrenamiento
- **Plan semanal** con rutinas específicas por día
- **Detalles de ejercicios** con series, repeticiones y descansos
- **Calentamiento y enfriamiento** incluidos
- **Tiempo estimado** para cada sesión

## 🔄 Migración desde Sistema Actual

### Datos Preservados
- **Base de alimentos** de sistema PN se mantiene intacta
- **Lecciones existentes** siguen funcionando normalmente
- **Portal de alumnos** no se ve afectado
- **Formularios actuales** continúan operativos

### Datos Migrados
- **Información de localStorage** se puede migrar a base de datos
- **Targets y preferencias** del sistema PN se incorporan
- **Progreso histórico** se puede importar

## 🎯 Próximos Pasos

### Inmediatos
1. **Conectar con base de datos real** (actualmente usa localStorage)
2. **Implementar autenticación** con NextAuth.js
3. **Sistema de notificaciones** para recordatorios
4. **Mobile responsive** optimizado

### Mediano Plazo
1. **Integración de pagos** con Flow
2. **Sistema de coaching** coach-cliente
3. **Analytics avanzados** y reportes
4. **Funciones empresariales**

### Largo Plazo
1. **App móvil** React Native
2. **Inteligencia artificial** para recomendaciones
3. **Marketplace de coaches**
4. **Integración con wearables**

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint

# Base de datos
npm run db:push      # Aplicar cambios de esquema
npm run db:studio    # Abrir Prisma Studio
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Crear nueva migración
npm run db:seed      # Poblar datos iniciales
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

---

**SaidCoach** - Transformando el coaching con tecnología inteligente 🚀