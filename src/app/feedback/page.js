import { useRouter } from "next/navigation";
import emailjs from "emailjs-com";
import { useRef } from "react";

export default function Feedback() {
  const router = useRouter();
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_saidcoach",
        "template_feedbackcoach",
        formRef.current,
        "8wJMwQoMn6zElgxvD"
      )
      .then(
        () => router.push("/gracias-feedback"),
        (error) => console.error("Error al enviar:", error.text)
      );
  };

  return (
    <main className="min-h-screen bg-[#000000] text-[#f4f1ec] px-4 py-12">
      <section className="max-w-3xl mx-auto animate-fade-up">
        <img src="/saidcoach-logo.svg" alt="Logo SaidCoach" className="mx-auto h-28 md:h-32 mb-6" />
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">📝 Formulario de Feedback y Objetivos</h1>
        <p className="text-center text-[#f4deb7] mb-8">
          Los resultados no dependen solo del entrenamiento. Tu descanso, tus hábitos y tu entorno también importan. <br />
          Mi misión es ayudarte a lograr tus objetivos, y si quieres, puedo acompañarte en esos otros aspectos también.
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-8 bg-[#f4deb7] text-gray-900 p-6 rounded-2xl shadow border-2 border-[#e79c00]"
        >
          {/* Aquí debes pegar el contenido completo del formulario */}
        </form>
      </section>
    </main>
  );
}


  
  