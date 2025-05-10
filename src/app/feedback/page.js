export default function Feedback() {
    return (
      <main className="min-h-screen bg-[#000000] text-[#f4f1ec] px-4 py-12">
        <section className="max-w-3xl mx-auto animate-fade-up">
          <img src="/saidcoach-logo.svg" alt="Logo SaidCoach" className="mx-auto h-28 md:h-32 mb-6" />
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">📝 Formulario de Feedback y Objetivos</h1>
          <p className="text-center text-[#f4deb7] mb-8">
            Los resultados no dependen solo del entrenamiento. Tu descanso, tus hábitos y tu entorno también importan. <br/>
            Mi misión es ayudarte a lograr tus objetivos, y si quieres, puedo acompañarte en esos otros aspectos también.
          </p>
  
          <form className="space-y-8 bg-[#f4deb7] text-gray-900 p-6 rounded-2xl shadow border-2 border-[#e79c00]">
            <fieldset>
              <legend className="text-xl font-semibold mb-2 text-[#000000]">👤 1. Información general</legend>
              <label className="block mb-2">Nombre
                <input type="text" name="nombre" className="w-full mt-1 px-4 py-2 rounded bg-white" required />
              </label>
              <label className="block mb-2">Fecha
                <input type="date" name="fecha" className="w-full mt-1 px-4 py-2 rounded bg-white" required />
              </label>
            </fieldset>
  
            <fieldset>
              <legend className="text-xl font-semibold mb-2 text-[#000000]">
                🏋️ 2. Experiencia con los entrenamientos<br/>
                <span className="text-sm font-normal">(Mientras más información nos des, mejor podremos ajustar tu programa a tus necesidades)</span>
              </legend>
              <label className="block mb-2">¿Cómo evaluarías tu experiencia general?
                <select name="experiencia" className="w-full mt-1 px-4 py-2 rounded bg-white">
                  <option>Excelente</option>
                  <option>Buena</option>
                  <option>Regular</option>
                  <option>Mala</option>
                </select>
              </label>
              <label className="block mb-2">¿Sientes que la intensidad está…?
                <select name="intensidad" className="w-full mt-1 px-4 py-2 rounded bg-white">
                  <option>Muy baja</option>
                  <option>Acorde</option>
                  <option>Muy alta</option>
                </select>
              </label>
              <label className="block mb-2">¿Qué ejercicios y/o grupos musculares te agrada trabajar?
                <input type="text" name="favoritos" className="w-full mt-1 px-4 py-2 rounded bg-white" />
              </label>
              <label className="block mb-2">¿Qué ejercicios consideras lateros o preferirías cambiar o sacar de tu entrenamiento?
                <input type="text" name="no_gustan" className="w-full mt-1 px-4 py-2 rounded bg-white" />
              </label>
              <label className="block">¿Qué sientes que le falta a tu entrenamiento? ¿Qué podríamos mejorar?
                <textarea name="mejoras" className="w-full mt-1 px-4 py-2 rounded bg-white" rows="4"></textarea>
              </label>
            </fieldset>
  
            <fieldset>
              <legend className="text-xl font-semibold mb-2 text-[#000000]">🎯 3. Objetivos y motivación actual</legend>
              <label className="block mb-2">Objetivo principal
                <select name="objetivo" className="w-full mt-1 px-4 py-2 rounded bg-white">
                  <option>Bajar grasa</option>
                  <option>Subir masa muscular</option>
                  <option>Rendimiento físico</option>
                  <option>Bienestar general</option>
                  <option>Otro</option>
                </select>
              </label>
              <label className="block mb-2">¿Qué te motiva actualmente?
                <input type="text" name="motivacion" className="w-full mt-1 px-4 py-2 rounded bg-white" />
              </label>
              <label className="block">¿Qué te desmotiva?
                <textarea name="desmotivacion" className="w-full mt-1 px-4 py-2 rounded bg-white" rows="4"></textarea>
              </label>
            </fieldset>
  
            <fieldset>
              <legend className="text-xl font-semibold mb-2 text-[#000000]">💬 4. Evaluación del servicio</legend>
              <label className="block mb-2">¿Sientes que el servicio justifica el valor?
                <select name="valor" className="w-full mt-1 px-4 py-2 rounded bg-white">
                  <option>Sí, totalmente</option>
                  <option>En parte</option>
                  <option>No mucho</option>
                  <option>No</option>
                </select>
              </label>
              <label className="block">¿Qué podríamos mejorar?
                <textarea name="mejorar_servicio" className="w-full mt-1 px-4 py-2 rounded bg-white" rows="4"></textarea>
              </label>
              <label className="block mb-2">¿Seguimiento adicional deseado?
                <select name="seguimiento" className="w-full mt-1 px-4 py-2 rounded bg-white">
                  <option>Ninguno</option>
                  <option>Nutrición</option>
                  <option>Hábitos</option>
                  <option>Higiene del sueño</option>
                  <option>Otro</option>
                </select>
              </label>
            </fieldset>
  
            <fieldset>
              <legend className="text-xl font-semibold mb-2 text-[#000000]">🔁 5. Proyección y compromiso</legend>
              <label className="block mb-2">¿Te comprometes a un hábito?
                <select name="compromiso" className="w-full mt-1 px-4 py-2 rounded bg-white">
                  <option>Sí</option>
                  <option>No estoy seguro(a)</option>
                  <option>No</option>
                </select>
              </label>
              <label className="block">¿Qué hábito te gustaría trabajar?
                <input type="text" name="habito" className="w-full mt-1 px-4 py-2 rounded bg-white" />
              </label>
            </fieldset>
  
            <fieldset>
              <legend className="text-xl font-semibold mb-2 text-[#000000]">🗣️ 6. Espacio libre</legend>
              <label className="block">¿Algo más que quieras decir o sugerir?
                <textarea name="libre" className="w-full mt-1 px-4 py-2 rounded bg-white" rows="4"></textarea>
              </label>
            </fieldset>
  
            <div className="text-center">
              <button type="submit" className="bg-[#e79c00] text-black font-semibold px-6 py-3 rounded hover:bg-[#f4deb7] transition">
                Enviar feedback
              </button>
            </div>
          </form>
        </section>
      </main>
    );
  }
  
  
  