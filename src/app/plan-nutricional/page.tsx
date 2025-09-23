'use client';

// 1. Importa el componente PlanGenerator
import PlanGenerator from './components/PlanGenerator';

// Si tienes otros componentes que ya usabas, impórtalos aquí también.
// import MiOtroComponente from './components/MiOtroComponente';

export default function Home() {
  return (
    <div>
      {/* Puedes agregar cualquier otro contenido HTML o componentes
        que ya tengas en tu página principal. Por ejemplo:
      */}
      {/* <h1>¡Bienvenido a mi aplicación!</h1> */}
      {/* <MiOtroComponente /> */}

      {/* 2. Renderiza el componente PlanGenerator aquí */}
      <PlanGenerator />
    </div>
  );
}
