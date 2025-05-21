import LeccionGenerica from '@/components/LeccionGenerica';

export default function LeccionSudarGrasa() {
  return (
    <LeccionGenerica
      nombreLeccion="sudar-grasa"
      nombreVideo="sudor_grasa.mp4"
      preguntaCerrada="¿Qué significa realmente sudar durante el ejercicio?"
      opcionesCerradas={[
        'Estoy quemando grasa al máximo',
        'Mi cuerpo regula la temperatura',
        'Sudé tanto que bajé 3 kilos',
      ]}
      respuestaCorrecta="Mi cuerpo regula la temperatura"
      preguntaBienestar="¿Qué cambia en tu forma de evaluar un entrenamiento después de esto?"
      opcionesBienestar={[
        'Menos drama con el sudor',
        'Voy a entrenar sin chaqueta de invierno',
        'Entendí que sudar ≠ quemar grasa',
      ]}
    />
  );
}
