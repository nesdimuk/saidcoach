// Plantilla para crear una nueva lección
// Duplica este archivo dentro de /src/app/lecciones/nombre-leccion/page.js

import LeccionGenerica from '@/components/LeccionGenerica';

export default function LeccionPlantilla() {
  return (
    <LeccionGenerica
      // Ruta y nombre del video (debe estar en /public/videos)
      nombreLeccion="nombre-de-la-leccion" // usado para mostrar en título y guardar el progreso
      nombreVideo="nombre_del_video.mp4"

      // Pregunta cerrada (basada en el contenido del video)
      preguntaCerrada="¿Cuál es la idea principal del video?"
      opcionesCerradas={[
        'Opción incorrecta 1',
        'Opción incorrecta 2',
        'Opción incorrecta 3',
        'Opción correcta',
      ]}
      respuestaCorrecta="Opción correcta"

      // Pregunta reflexiva: para conectar emocionalmente o generar conciencia
      preguntaBienestar="¿Qué cambiarías o qué aprendiste después de ver este video?"
      opcionesBienestar={[
        'Me lo tomaré con más calma',
        'Voy a aplicar esto en mi día a día',
        'Lo entendí con humor, pero me hizo sentido',
      ]}
    />
  );
}
