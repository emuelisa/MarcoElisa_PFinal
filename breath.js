/*⭐ ------------------------------------------------ REGISTRO DE PLUGINS de GSAP ------------------------------------------------------ ⭐*/ 

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrambleTextPlugin);
gsap.registerPlugin(DrawSVGPlugin);

//

// Seleccionamos los elementos del DOM
const loadingScreen = document.getElementById('loading-screen');
const startButton = document.getElementById('start-btn');

// Agregamos un evento al botón para ocultar el modal
startButton.addEventListener('click', () => {
    // Oculta el modal con la clase 'hidden'
    loadingScreen.classList.add('hidden');
    
    // Permitir el scroll en el cuerpo de la página
    document.body.classList.remove('hidden');
});

//

const button = document.querySelector(".scrolltelling-btn");

button.addEventListener("click", (e) => {
  e.preventDefault(); // Evita la navegación inmediata

  // Añade la clase "clicked" para iniciar la animación
  button.classList.add("clicked");

  // Redirige a la nueva página después de que termine la animación
  setTimeout(() => {
    window.location.href = button.getAttribute("href");
  }, 800); 
});

//

const instruction = document.querySelector(".instruction h1  ");
const counter = document.querySelector(".counter");
const circles = Array.from(document.querySelectorAll(".expanding-circle"));
const mainCircle = document.querySelector(".main-circle");
const hola = document.querySelector(".instruction p");

let currentStep = 0; // Controla el paso actual
let currentPhase = "none"; // Fase actual: 'inspirar', 'mantener', etc.
let isAnimating = false; // Indica si hay animación en curso
let breathTimeline = null; // Almacena la timeline actual

//🔶Función para iniciar la fase de INSPIRACIÓN
function startInspiration() {

  isAnimating = true;
  currentPhase = "inspirar";

  instruction.textContent = "Inspira"; // Actualiza el texto de la instrucción

  // Crear una nueva timeline para la inspiración
  breathTimeline = gsap.timeline({
    onComplete: startHoldPhase, // Cambiar a la fase 'Mantener' al terminar
  });

  toggleAnimation(); 
  // Progresivamente animar cada paso
  breathTimeline
    .call(() => updateStep(1))
    .to(circles[0], { scale: 1.3, duration: 1, ease: "power2.out" })
    .call(() => updateStep(2))
    .to(circles[1], { scale: 1.6, duration: 1, ease: "power2.out" })
    .call(() => updateStep(3))
    .to(circles[2], { scale: 1.9, duration: 1, ease: "power2.out" })
    .call(() => updateStep(4))
    .to(circles[3], { scale: 2.2, duration: 1, ease: "power2.out" });
}

//🔶Función para iniciar la fase de MANTENER

function startHoldPhase() {
  if (currentPhase !== "inspirar") return; // Evitar reiniciar si ya está en animación
  isAnimating = true;
  currentPhase = "mantener"; // Cambia a la fase de 'Mantener'


  instruction.textContent = "Mantén el aire"; // Actualiza el texto de la instrucción
  
  currentStep = 0; // Reinicia el contador
  
  updateStep(1);

  // Guardar las escalas actuales de los círculos al final de la fase "Inspirar"
  const finalScales = Array.from(circles).map((circle) =>
    parseFloat(window.getComputedStyle(circle).transform.match(/matrix\((.+)\)/)[1].split(", ")[0])
  );

  breathTimeline = gsap.timeline({

      onComplete: startExhalePhase,
  });

  // Crear una nueva timeline para la fase de Mantener
  
  for (let i = 1; i <= 4; i++) {
      breathTimeline
        .call(() => updateStep(i)) // Actualizar el contador
        .to(
          circles,
          {
            scale: (index) =>
              finalScales[index] * (i % 2 === 0 ? 1.05 : 0.95), // Oscilar entre 1.05x y 0.95x
            duration: 0.5,
            ease: "sine.inOut",
          },
          `+=0.5` // Cada "latido" dura 1 segundo
        );
    }
}
  
function startExhalePhase() {
  if (currentPhase !== "mantener") return;  
  
  isAnimating = true;
  currentPhase = "exhalar"; // Cambia a la fase de 'Exhalar'

  instruction.textContent = "Suelta el aire"; // Actualiza la instrucción
  toggleAnimation();
  
  currentStep = 0; // Reinicia el contador

  updateStep(1);

  // Animar la exhalación en 4 pasos
  breathTimeline = gsap.timeline({
    onComplete: () => {
      counter.textContent = " "; 
      instruction.textContent = "Mantén por un momento"
      
      gsap.delayedCall(4, startInspiration); //Tras 4 segundos, se reinicia la fase de inspiración
    },
  });
  
  for (let i = 1; i <= 4; i++) {
    breathTimeline
      .call(() => updateStep(i)) // Actualizar el contador
      .to(
        circles.slice(4 - i), // Encoger progresivamente los círculos desde el último al primero
        {
          scale: 1, // Regresa al tamaño inicial
          duration: 1, // Cada paso dura 1 segundo
          ease: "power2.inOut",
        },
        `+=0` // Iniciar inmediatamente después del paso previo
      );
  }
  
}
  
function resetPhase() {
  // Resetea todo a su estado inicial
  currentPhase = "none";
  instruction.textContent = "Inspira"; // Reinicia la instrucción a "Inspira"
  updateStep(0); // Reinicia el contador
  gsap.to(circles, {
    scale: 1, // Todos los círculos regresan a su escala inicial
    duration: 0.5,
    ease: "power2.out",
  });
}      

// Función para resetear la animación
function resetCircles() {

    isAnimating = false;
    currentStep = 0;
    currentPhase = "none"; // Reinicia la fase
    instruction.textContent = "Inicia de nuevo";
    counter.textContent = "";

    toggleAnimation();

    // Detiene cualquier animación en curso
    if (breathTimeline) {
        breathTimeline.kill();
        breathTimeline = null;
    }

    // Resetea progresivamente los círculos
    circles.forEach((circle) => {
        gsap.to(circle, { scale: 1, duration: 0.5, ease: "power2.inOut" });
    });
    
}

//🔶Función para actualizar el contador en cada paso
function updateStep(step) {
  currentStep = step;
  counter.textContent = currentStep; // Muestra el paso actual
}

//🔶Detectar la barra espaciadora para iniciar o resetear

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault(); // Evitar el scroll con la barra espaciadora
    if (!isAnimating) startInspiration();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    resetCircles(); // Resetea si se suelta la barra espaciadora
  }
});

//🔶01. Detectar 'clic' en el círculo principal para iniciar o resetear

mainCircle.addEventListener("mousedown", startInspiration);
mainCircle.addEventListener("mouseup", resetCircles);

function toggleAnimation() {
    if (isAnimating) {
      //Desaparece el páarrafo por defecto
      gsap.to(hola, {
        opacity: 0,
        duration: 1, // Duración del desvanecimiento
        ease: "power2.out" // Efecto de suavizado
      });
    } else {
      //Aparece el párrafo por defecto
      gsap.to(hola, {
        opacity: 1,
        duration: 1, // Duración del desvanecimiento
        ease: "power2.out" // Efecto de suavizado
      });
    }
  }

//🔶02. Detectar el 'toque' en el círculo principal para iniciar o resetear

const startPress = (e) => {
  e.preventDefault(); // Evitar la selección de texto en dispositivos móviles, si no no deja presionar
  if (isAnimating) return; // Si ya estamos en animación, no hacer nada
  
  startInspiration(); // Inicia la animación de inspiración cuando se presiona
};

const endPress = (e) => {
  e.preventDefault(); // Evitar la selección de texto al soltar en móviles
  resetCircles(); // Resetea los círculos y la animación cuando se suelta
};

//🔸En dispositivos táctiles con mousedown mouseup no funcionaba. Hay que trabajar con touchstart y touchend.

mainCircle.addEventListener("mousedown", startPress); // Para escritorio
mainCircle.addEventListener("touchstart", startPress); // Para móvil (inicio de la presión)

mainCircle.addEventListener("mouseup", endPress); // Para escritorio
mainCircle.addEventListener("touchend", endPress); // Para móvil (fin de la presión)

//🔸También está guay usar esto (`touchcancel` y `mouseleave`) para mayor control si el usuario desliza fuera del área del div
mainCircle.addEventListener("mouseleave", endPress); // Si el mouse sale del área
mainCircle.addEventListener("touchcancel", endPress); // Si el toque se cancela o el dedo se mueve fuera del div





 
