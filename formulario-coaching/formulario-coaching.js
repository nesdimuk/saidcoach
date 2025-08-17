export default function FormularioCoaching() {
  return (
    <div className="min-h-screen p-4 bg-[#000000] text-[#f4f1ec] flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center" style={{ color: '#e79c00' }}>
        Formulario Coaching Personalizado
      </h1>
      <p className="text-md md:text-lg text-[#f4deb7] mb-8 text-center">
        Por favor, completa el siguiente formulario para que podamos entender mejor tus necesidades y diseñar un programa a tu medida.
      </p>
      <iframe
        src="https://docs.google.com/forms/d/1gMiDrH7Ahm1BsL7DNvxHX39NzQ9-6RqA5jkqqAusE98/viewform?embedded=true"
        width="100%"
        height="1800"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Formulario Coaching"
      >
        Cargando…
      </iframe>
    </div>
  );
}
