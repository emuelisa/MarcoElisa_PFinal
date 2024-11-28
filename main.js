
/*⭐ ------------------------------------------------ REGISTRO DE PLUGINS de GSAP ------------------------------------------------------ ⭐*/ 

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrambleTextPlugin);
gsap.registerPlugin(DrawSVGPlugin);
gsap.registerPlugin(ScrollToPlugin);


/*⭐ ------------------------------------------------------ INTRODUCCIÓN ---------------------------------------------------------------- ⭐*/

/* Las animaciones de este proyecto están basadas principalmente en ScrollTrigger de GSAP. Cada sección ocupa el 100% del alto del viewport (100vh) y activa su propia animación al entrar en escena. El desplazamiento está sincronizado con las animaciones, de modo que no se avanza a la siguiente sección hasta que la animación actual finaliza. De esta forma, consigo un scrolltelling dinámico, donde es el usuario quien construye la interfaz a medida que avanza, teniendo el control sobre lo que va apareciendo en pantalla y cómo evoluciona la experiencia visual. */


/* ----------------------------------------------------------------------------------------------------------------------------------------- */

//🔶SECCIÓN WELCOME - Animación de la línea que crece dinámicamente hasta tocar la parte de abajo de la sección

const welcome = document.querySelector('#hola');
const line = welcome.querySelector('.line');

const tl00 = gsap.timeline({
  scrollTrigger: {
    trigger: welcome,
    start: "top top", 
    end: "bottom top", 
    scrub: true, 
    pin: true, 
    pinSpacing: true,
  }
});

tl00.fromTo(line,
    { height: '0px' }, 
    { height: '42vh', ease: 'power1.out' } 
);


document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".fade-in-title");
  
  // Asegúrate de que el DOM está cargado antes de añadir la clase
  setTimeout(() => {
      title.classList.add("visible"); // Añade la clase después de un pequeño retraso
  }, 100); // Pequeño retraso para asegurar que se aplica la transición
});
/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 TEXTO FIXED - Texto en el margen izquierdo que cambia dinámicamente para indicar la sección del scrolltelling en la que se encuentra el 
usuario. Pense en hacer un menú al uso pero me acabé decantando por esto que era más sutil ya que quiero darle más importancia al contenido. */

const sectionText = document.querySelector('.section-id');

// Array con las secciones y sus textos
const sections = [
  { id: "hola", text: "" },
  { id: "reconocimiento", text: "RECONOCIMIENTO DE LA EXPERIENCIA" },
  { id: "sintomas", text: "RECONOCIMIENTO DE LOS SÍNTOMAS" },
  { id: "estrategias", text: "ESTRATEGIAS DE MANEJO" },
  { id: "ayuda", text: "PIDE AYUDA" },
  { id: "cierre", text: "CIERRE"},
];

document.addEventListener("DOMContentLoaded", () => { //Si todo el contenido de la página no esta cargado, no funcionará correctamente
  sections.forEach(({ id, text }) => {
    ScrollTrigger.create({
      trigger: `#${id}`, // Selector por secciones
      start: "top center",
      end: "bottom center", 
      onEnter: () => {
        // Animo la opacidad hacia 0 antes de cambiar el texto
        gsap.to(sectionText, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            // Cambiar el texto después de que la opacidad llega a 0
            sectionText.textContent = text;
            // Animo la opacidad de vuelta a 1
            gsap.to(sectionText, { opacity: 1, duration: 0.5 });
          }
        });
      },
      onEnterBack: () => {
        // Mismo comportamiento al volver a la sección
        gsap.to(sectionText, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            sectionText.textContent = text;
            gsap.to(sectionText, { opacity: 1, duration: 0.5 });
          }
        });
      }
    });
});
});
/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN 01 - El texto comienza con un color muy clarito. Divido el texto en carácteres para poder aplicar letra por letra un color más
oscuro. Así da la sensación que el texto se va 'desbloqueando' a medida que el usuario hace scroll.  */

const bloque01 = document.querySelector('.uno');
const texto01 = bloque01.querySelectorAll('p');

// Divido el texto en letras 
const text = new SplitText(texto01, { type: "words" });

const tl01 = gsap.timeline({
  scrollTrigger: {
    trigger: bloque01,
    start: "top top", 
    end: "bottom top", 
    scrub: true, 
    pin: true, 
  }
});

tl01.fromTo(
  text.words, 
  {
    color: "#D4D8D0", // Color inicial clarito
  }, 
  {
    color: "#777E79", // Color final más oscuro
    duration: 1.5,
    stagger: 0.05,
    ease: "power2.out", 
  }
);

/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN 02 - ANIMACIÓN GSAP DRAW SVG. Quería simular un lío mental para conceptualizar cómo se debe estar sintiendo el usuario
cuando entra a la experiencia.  */

const bloque02 = document.querySelector('.dos');
const h202 = bloque02.querySelector('h2');
const sc02 = bloque02.querySelector('.section-content');

const path = document.querySelector(".morphPath path");

gsap.set(path, {drawSVG: '0%'});

const tl02 = gsap.timeline({
  scrollTrigger: {
    trigger: bloque02, 
    start: "top top", 
    end: "bottom top",
    scrub: true, 
    pin: true,
  }
});

tl02
  .fromTo(h202,
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 0.5} 
  )
  .fromTo(sc02,
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 0.5} 
  )
  .to(path, { 
  drawSVG: '40%',
  duration: 2,
  });

/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN 03.01 - Animación del carrusel horizontal. Se trata de un carrusel con items. Cuando el usaurio entra en la sección 03, el scroll
pasa de ser vertical a ser horrizontal para recorrer todos los items hasta el final. Este cambio de scroll lo he 'forzado' mediante un translateX
del carrusel. El overflow queda oculto por el contenedor del carrusel.  */

const bloque03 = document.querySelector('.tres');
const carousel = bloque03.querySelector('.carousel');
const h203 = bloque03.querySelector('h2');
const sc03 = bloque03.querySelector('.section-content');

const getTranslateXValue = () => {
  return window.innerWidth < 1024 ? '-585vw' : '-195vw'; // Usar -100vw para móviles y -195vw para otros
};

const tl03 = gsap.timeline({
    scrollTrigger: {
      trigger: bloque03,
      start: "top top",
      end: "bottom top",
      scrub: 5,
      pin: true,
    },
  });

  tl03
  .fromTo(h203,
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 0.8}
  )
  .fromTo(sc03,
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 0.8} 
  )
  .fromTo(carousel,
    {opacity: 0},
    {opacity: 1, duration: 0.8}
  )
  .fromTo(carousel, 
    {x:'0px'}, 
    {x: getTranslateXValue(),
     ease: "power2.inOut", // Suaviza el desplazamiento
     duration: 100, // Hace que el desplazamiento sea menos brusco (una especie de scroll smooth)
    } 
  )
  .fromTo(carousel,
    {opacity: 1},
    {opacity: 0, duration: 0.8}
  )
  .to({}, {duration: 2});

/*🔶 SECCIÓN 03.02 - Control de la aparición de la información en los items del carrusel. Cada síntoma contiene una descrición algo extensa, la cual he decidido ocultar (solo se muestra título y pequeña descripción) Cuando el usuario hace click sobre un síntoma puede desplegar la información. Esto lo hago mediante el control de los items 'active' del carrusel. Solo puede haber 1 item abierto, hay una función que verifica si hay algun item abierto para cerrarlo antes de abirir otro */


const carouselItems = document.querySelectorAll('.carousel-item');

carouselItems.forEach(item => {
  item.addEventListener('click', () => {
    // Verifico si el elemento ya está activo
    const isActive = item.classList.contains('active');

    // Cierro todos los items del carrusel
    carouselItems.forEach(innerItem => {
      innerItem.classList.remove('active');
    });

    // Si no estaba activo, lo activamo
    if (!isActive) {
      item.classList.add('active');
    }
  });
});


/*🔶 SECCIÓN 03.03 - Custom mouse para cuando se hace hover sobre un item del carrusel. Para que el usaurio sepa que puede desplegar más información en los items, he decidido hacer que el mouse al hacer hover sobre un item se convierta en un círculo con el símbolo + */

carouselItems.forEach(item => {
    let circlePlus;
    
    const isDesktop = () => window.innerWidth >= 1024;

    item.addEventListener('mouseenter', function() {
        if (!isDesktop()) return;

        // Crear un nuevo elemento div para el círculo
        circlePlus = document.createElement('div');
        circlePlus.classList.add('circle-plus');
       
        circlePlus.innerText = "+"; // El signo +
        

        item.appendChild(circlePlus);

        // Activar la animación de aparición
        setTimeout(() => {
            circlePlus.style.transform = 'scale(1.3)';
            circlePlus.style.opacity = '1';
        }, 10);
    });

    // Mover el círculo con el ratón
    item.addEventListener('mousemove', function(e) {
      if (!isDesktop() || !circlePlus) return;

      const mouseX = e.clientX; 
      const mouseY = e.clientY; 
      
      const offsetX = 15;  
      const offsetY = 15; 

      // Posicionar el círculo en las coordenadas del ratón
      circlePlus.style.left = `${mouseX - item.getBoundingClientRect().left - offsetX}px`;
      circlePlus.style.top = `${mouseY - item.getBoundingClientRect().top - offsetY}px`;

      if( item.classList.contains('active')) {
        circlePlus.innerHTML = '<span class="inner-text">_</span>';

      }else {
        circlePlus.innerText = "+"; // El signo +
      }
    });

    // Eliminar el círculo cuando el mouse sale
    item.addEventListener('mouseleave', function() {
      if (!isDesktop() || !circlePlus) return;
            // Iniciar la animación de desaparición
            circlePlus.style.transform = 'scale(0)';
            circlePlus.style.opacity = '0';

            setTimeout(() => {
                circlePlus.remove();
            }, 300); 
        
    });
});

/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN 04 - Cambio de colores del root en la sección 4 (para hacer una especie de darkmode, así la transición entre secciones queda más limpia). También una pequeña animación de los textos para que aparezcan más suavemente. */


const bloque04 = document.querySelector(".cuatro");
const h204 = bloque04.querySelector('h2');
const sc04 = bloque04.querySelector('.section-content');

const tl04 = gsap.timeline({
  scrollTrigger: {
      trigger: bloque04, 
      start: "top top",   
      end: "bottom top",  
      scrub: true,
      pin: true,  
     
      onEnter: () => {
          // Cambiar colores al entrar en la sección "fin"
          gsap.to(root, { 
              "--color-1": "#F9F5F0", // Cambiar a color-3
              "--color-3": "#777E79", // Cambiar a color-1
              duration: 0.5 
          });
      },
      onEnterBack: () => {
          // Revertir colores al salir de la sección "fin" hacia atrás
          gsap.to(root, { 
              "--color-1": "#777E79", // Volver a color-1
              "--color-3": "#F9F5F0", // Volver a color-3
              duration: 0.5 
          });
      },
      onLeaveBack: () => {
          // Revertir colores al salir de la sección "fin" hacia atrás
          gsap.to(root, { 
              "--color-1": "#777E79", // Volver a color-1
              "--color-3": "#F9F5F0", // Volver a color-3
              duration: 0.2 
          });
      },
      onLeave: () => {
          // Volver a los colores originales al salir de la sección
          gsap.to(root, { 
              "--color-1": "#777E79", // Volver a color-1
              "--color-3": "#F9F5F0", // Volver a color-3
              duration: 0.5 
          });
      }
  }
});

tl04.fromTo(h204,
  { opacity: 0, y: 50 }, 
  { opacity: 1, y: 0, duration: 0.5}
)
.fromTo(sc04,
  { opacity: 0, y: 50 }, 
  { opacity: 1, y: 0, duration: 0.5}, 
)
.to({}, {duration: 2}); //He añadido una pequeña pausa al terminar proque si no pasaba de sección muy rápido

/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN 05 - Animación sección ENFÓCATE. Texto que inicialmente esta desenfocado y pasa a enfocarse mediente la propiedad blur de CSS */

const bloque05 = document.querySelector('.cinco');
const enfocate = bloque05.querySelector('.enfocate');

const tl05 = gsap.timeline({
  scrollTrigger: {
    trigger: bloque05, 
    start: "top top",
    end: "bottom top",   
    scrub: true,
    pin: true, 
  },
});

tl05.fromTo(
  enfocate, 
  { filter: "blur(10px)" },  // Estado inicial
  { filter: "blur(0px)" } // Estado final
)
.to({}, {duration: 2}); //He añadido una pequeña pausa al terminar proque si no pasaba de sección muy rápido

/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN 06 - Animación sección RESPIRA. Son 4 círculos concentricos que simulan una inspiración para complementar el texto */

const bloque06 = document.querySelector('.seis');
const bcir = bloque06.querySelectorAll('.breath .circle');

const tl06 = gsap.timeline({
  scrollTrigger: {
    trigger: bloque06, 
    start: "top top",
    end: "bottom top",   
    scrub: 1.5,
    pin: true, 
  },
});

//Los círculos crecen uno detrás de otro y tamaños cada vez más grandes para simular una inspiración, como los círculos de la experiencia de respiración

tl06
.to(bcir[0], { 
  width: "25vw", 
  height: "25vw", 
  opacity: 1, 
  duration: 1,
  ease: "power1.out",
})
.to(bcir[1], { 
  width: "50vw", 
  height: "50vw", 
  opacity: 1, 
  duration: 1,
  ease: "power1.out",
}, "+=0.5")  
.to(bcir[2], { 
  width: "75vw", 
  height: "75vw", 
  opacity: 1, 
  duration: 1,
  ease: "power1.out",
}, "+=0.5") 
.to(bcir[3], { 
  width: "100vw", 
  height: "100vw", 
  opacity: 1, 
  duration: 1,
  ease: "power1.out",
}, "+=0.5")
.to({}, {duration: 3}); //He añadido una pequeña pausa al terminar proque si no pasaba de sección muy rápido 

/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN 07 - Es una animación para mostrar los diferentes tipos de ayuda que puede tener el usaurio. Al principio aparece un solo círculo 
(el usuario está solo) luego aparece un mensaje que pone que puede pedir ayuda de la forma más cómoda para él. Y los círculos de ayuda se despliegan para cambiar la situacion (el usauario ya no esta solo) */

const bloque07 = document.querySelector('.siete');
const circles = bloque07.querySelectorAll('.help-item');
const sietest = bloque07.querySelector(".section-content");
const tex = bloque07.querySelectorAll(".help-text");

const tl07 = gsap.timeline({
  scrollTrigger: {
    trigger: bloque07, 
    start: "top top", 
    end: "bottom top",
    scrub: 2,
    pin: true, 
  },
});

//El texto empieza oculto y desplazado y tiene una pequeña animación para aparecer
tl07
  .fromTo(sietest,
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 1} 
  );

  // Función para detectar el tamaño de la pantalla
  function getDeviceSize() {
    const width = window.innerWidth;
  
    if (width <= 768) {
      return "mobile"; // Para pantallas de móvil (ancho <= 768px)
    } else if (width <= 1024) {
      return "tablet"; // Para pantallas de tablet (768px < ancho <= 1024px)
    } else {
      return "desktop"; // Para pantallas de escritorio (ancho > 1024px)
    }
  }
  

// Establecer los valores diferentes dependiendo del tamaño de la pantalla
function setCircleValues() {
  const device = getDeviceSize();

  // Establecer los valores de posición y tamaño de cada círculo según el dispositivo
  if (device === "mobile") {
    return {
      circle1: { width: "18vh", height: "18vh", x: "-15vw", y: "-56vh" },
      circle2: { x: "-70vw", y: "-11vh" },
      circle3: { width: "27vh", height: "27vh", x: "-52vw", y: "-38vh" },
      circle4: { width: "11vh", height: "11vh", x: "-70vw", y: "-55vh" },
    };
  } else if (device === "tablet") {
    console.log("tablet");
    return {
      circle1: { width: "28vh", height: "28vh", x: "0vw", y: "-35vh" },
      circle2: { x: "-55vw", y: "2vh" },
      circle3: { width: "25vh", height: "25vh", x: "-35vw", y: "-23vh" },
      circle4: { width: "14vh", height: "14vh", x: "-60vw", y: "-38vh" },
    };
  } else { // Para escritorio (desktop)
    return {
      circle1: { width: "26vh", height: "26vh", x: "10vw", y: "-45vh" },
      circle2: { x: "-40vw", y: "5vh" },
      circle3: { width: "23vh", height: "23vh", x: "-20vw", y: "-20vh" },
      circle4: { width: "16vh", height: "16vh", x: "-65vw", y: "-10vh" },
    };
  }
}

// Recuperar los valores para los círculos dependiendo de cada dispositivo
const circleValues = setCircleValues();

//Los círculos se colocan en sus lugares. Algunos cambian también de tamaño
tl07
  .to(circles[1], { width: circleValues.circle1.width, height: circleValues.circle1.height, x: circleValues.circle1.x, y: circleValues.circle1.y, duration: 1 }, "<")
  .to(circles[2], { x: circleValues.circle2.x, y: circleValues.circle2.y, duration: 1 }, "<")
  .to(circles[3], { width: circleValues.circle3.width, height: circleValues.circle3.height, x: circleValues.circle3.x, y: circleValues.circle3.y, duration: 1 }, "<")
  .to(circles[4], { width: circleValues.circle4.width, height: circleValues.circle4.height, x: circleValues.circle4.x, y: circleValues.circle4.y, duration: 1 }, "<")
  .fromTo(tex, { opacity: 0, duration: 1 },{ opacity: 1, duration: 1 }, "<")
  .to({}, {duration: 2}); // Pausa adicional

/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN 08 - Animación que hace pequeña la palabra ansiedad para simbolizar que esta desaparece */

const bloque08 = document.querySelector('.ocho');
const ansiedad = bloque08.querySelector('.ansiedad');
const mensaje = bloque08.querySelector('.mensaje');

// Determinar los valores de 'y' según el tamaño de pantalla
const getYValueForAnsiedad = () => (window.innerWidth < 1024 ? -10 : -80);
const getYValueForMensaje = () => (window.innerWidth < 1024 ? -10 : -120);

const tl08 = gsap.timeline({
  scrollTrigger: {
    trigger: bloque08,
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
  },
});

// Reducir el tamaño de "ANSIEDAD"
tl08.to(ansiedad, {
  scale: 0.1,
  y: getYValueForAnsiedad(), // Usar el valor dinámico para 'y'
  duration: 3,
  ease: "power3.out",
});

// Aparición del mensaje final
tl08.to(mensaje, {
  opacity: 1, // Cambia opacidad de 0 a 1
  y: getYValueForMensaje(), // Usar el valor dinámico para 'y'
  duration: 2,
  ease: "power2.inOut",
})
.to({}, {duration: 3}); //He añadido una pequeña pausa al terminar proque si no pasaba de sección muy rápido 


/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN 09 - TRANSICIÓN DE COLOR. Quería que hUbiera una transición entre fondo blanco y fondo verde oscuro. Para que esta transición fuera suave he decidido invertir los colores del root así cambian todos los colores (es similar a una transición de dark mode) */

const bloque09 = document.querySelector(".fin");


const root = document.documentElement;

const tl09 = gsap.timeline({
    scrollTrigger: {
        trigger: bloque09, 
        start: "top 80%",   
        end: "bottom 20%",  
        scrub: true,       
        onEnter: () => {
            // Cambiar colores al entrar en la sección "fin"
            gsap.to(root, { 
                "--color-1": "#F9F5F0", 
                "--color-3": "#777E79", 
                duration: 0.5 
            });
        },
        onEnterBack: () => {
            // Revertir colores al salir de la sección "fin" hacia atrás
            gsap.to(root, { 
                "--color-1": "#777E79",
                "--color-3": "#F9F5F0", 
                duration: 0.5 
            });
        },
        onLeaveBack: () => {
            // Revertir colores al salir de la sección "fin" hacia atrás
            gsap.to(root, { 
                "--color-1": "#777E79", 
                "--color-3": "#F9F5F0",
                duration: 0.2 
            });
        },
        onLeave: () => {
            // Volver a los colores originales al salir de la sección
            gsap.to(root, { 
                "--color-1": "#777E79", 
                "--color-3": "#F9F5F0", 
                duration: 0.5 
            });
        }
    }
});

/* ----------------------------------------------------------------------------------------------------------------------------------------- */

/*🔶 SECCIÓN FINAL - Animación para el botón de volver a la experiencia de respiración */

const volverBtn = document.querySelector('.volver-btn');
const emoji = volverBtn.querySelector('.emoji');
const texto = volverBtn.querySelector('.texto');

// Creamos una timeline con GSAP
const tl10 = gsap.timeline({
  scrollTrigger: {
    trigger: volverBtn, // El botón se anima al llegar a su sección
    start: "top bottom", // Inicia cuando el botón entra al centro de la pantalla
  
    toggleActions: "restart pause reverse pause",
  }
});

// Configuramos la animación
tl10
  .to(volverBtn, {
    duration: 1,
    width: "200px", // Aumenta el ancho del botón
    borderRadius: "25px", // Cambia de circular a un botón con bordes redondeados
    ease: "power1.out",
  })
  .to(emoji, {
    duration: 0.5,
    opacity: 0, // Oculta el emoji
    ease: "power1.out",
  }, "-=0.5") // Se solapan las animaciones para mayor fluidez
  .to(texto, {
    duration: 0.5,
    opacity: 1, // Muestra el texto
    ease: "power1.out",
  });


