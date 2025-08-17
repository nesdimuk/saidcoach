import LeccionGenerica from '../../../components/LeccionGenerica'

export default function LeccionHidratacionCerebro() {
  return (
    <LeccionGenerica
      nombreLeccion="hidratacion-cerebro"
      nombreVideo="hidratacion_cerebro.mp4"
      preguntaCerrada="¿Qué ocurre cuando pierdes solo un 2% de agua corporal?"
      opcionesCerradas={[
        'Te concentras mejor',
        'No pasa nada relevante',
        'Disminuye tu memoria, atención y ánimo',
      ]}
      respuestaCorrecta="Disminuye tu memoria, atención y ánimo"
      preguntaBienestar="¿Qué acción podrías aplicar después de esta lección?"
      opcionesBienestar={[
        'Tener una botella a la vista mientras trabajo',
        'Seguir tomando solo café',
        'Recordar tomar agua después de cada bloque de tareas',
      ]}
    />
  );
}
