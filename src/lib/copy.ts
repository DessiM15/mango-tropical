import type { Locale } from "./i18n";

/**
 * Every string the interface renders, in both languages. Kept in one file so a
 * change to one language is impossible to ship without seeing the other.
 */
export const copy = {
  nav: {
    menu: { en: "Menu", es: "Menú" },
    build: { en: "Build Your Own", es: "Arma la Tuya" },
    about: { en: "Our Story", es: "Nosotros" },
    visit: { en: "Visit", es: "Visítanos" },
    call: { en: "Call", es: "Llamar" },
    skip: { en: "Skip to content", es: "Saltar al contenido" },
    open: { en: "Open menu", es: "Abrir menú" },
    close: { en: "Close menu", es: "Cerrar menú" },
    switchTo: { en: "Español", es: "English" },
  },
  hero: {
    eyebrow: { en: "Cypress, Texas", es: "Cypress, Texas" },
    line1: { en: "MANGONADA", es: "ES TEMPORADA" },
    line2: { en: "SEASON", es: "DE MANGONADA" },
    sub: {
      en: "Nieves de garrafa churned by hand. Raspas shaved to order. Elotes drowned in the good stuff. All natural, all day, on FM 529.",
      es: "Nieves de garrafa batidas a mano. Raspas al momento. Elotes ahogados en lo bueno. Todo natural, todo el día, en FM 529.",
    },
    primary: { en: "See the menu", es: "Ver el menú" },
    secondary: { en: "Get directions", es: "Cómo llegar" },
    scroll: { en: "Scroll", es: "Desliza" },
  },
  status: {
    openNow: { en: "Open now", es: "Abierto ahora" },
    closed: { en: "Closed right now", es: "Cerrado ahora" },
    until: { en: "until", es: "hasta las" },
    opensAt: { en: "Opens at", es: "Abre a las" },
    today: { en: "Today", es: "Hoy" },
  },
  marquee: {
    en: "MANGONADA · RASPAS · NIEVE DE GARRAFA · ELOTE CHORREADO · CHAMOYADA · FRESAS CON CREMA · SALCHIPAPAS · AGUAS FRESCAS · TAMARINDO · GUAYABA ·",
    es: "MANGONADA · RASPAS · NIEVE DE GARRAFA · ELOTE CHORREADO · CHAMOYADA · FRESAS CON CREMA · SALCHIPAPAS · AGUAS FRESCAS · TAMARINDO · GUAYABA ·",
  },
  menuSection: {
    kicker: { en: "The menu", es: "El menú" },
    title: { en: "PICK YOUR POISON", es: "ESCOGE TU ANTOJO" },
    body: {
      en: "Twelve nieve flavors. Eighteen raspa flavors. Elotes, fries and nachos when you want something salty first. Everything made the way it is made back home.",
      es: "Doce sabores de nieve. Dieciocho de raspa. Elotes, papas y nachos cuando quieres algo salado primero. Todo hecho como se hace allá.",
    },
    viewAll: { en: "See the full menu", es: "Ver el menú completo" },
    viewCategory: { en: "See all", es: "Ver todo" },
    from: { en: "from", es: "desde" },
    seasonal: { en: "Seasonal", es: "De temporada" },
    toppingsTitle: { en: "Toppings", es: "Toppings" },
    toppingsNote: { en: "Add any topping for", es: "Agrega cualquier topping por" },
    flavorsTitle: { en: "Flavors", es: "Sabores" },
    priceNote: {
      en: "Prices are the ones printed on the in store menu and may change.",
      es: "Los precios son los del menú impreso en la tienda y pueden cambiar.",
    },
  },
  build: {
    kicker: { en: "Build your own", es: "Arma la tuya" },
    title: { en: "MAKE IT YOURS", es: "HAZLA TUYA" },
    body: {
      en: "Go wild. We will not judge. Pick your size, your nieve, your fruit and how much chamoy you can handle, then show the counter what you came for.",
      es: "Vuélvete loco. Aquí nadie juzga. Escoge tamaño, nieve, fruta y cuánto chamoy aguantas, y luego enséñale al mostrador a qué viniste.",
    },
    cta: { en: "Start building", es: "Empezar a armar" },
    steps: {
      size: { en: "Size", es: "Tamaño" },
      base: { en: "Nieve base", es: "Base de nieve" },
      fruit: { en: "Fruit", es: "Fruta" },
      chamoy: { en: "Chamoy level", es: "Nivel de chamoy" },
      toppings: { en: "Toppings", es: "Toppings" },
    },
    total: { en: "Total", es: "Total" },
    yourCreation: { en: "YOUR CREATION", es: "TU CREACIÓN" },
    empty: { en: "Nothing picked yet", es: "Todavía no escoges nada" },
    showCounter: { en: "Show this at the counter", es: "Enseña esto en el mostrador" },
    copyLink: { en: "Copy link", es: "Copiar enlace" },
    copied: { en: "Link copied", es: "Enlace copiado" },
    startOver: { en: "Start over", es: "Empezar de nuevo" },
    callToOrder: { en: "Call to order", es: "Llamar para ordenar" },
    counterNote: {
      en: "This is not an online order. Bring this screen to the counter or call it in.",
      es: "Esto no es un pedido en línea. Trae esta pantalla al mostrador o llama por teléfono.",
    },
    noToppings: { en: "No toppings", es: "Sin toppings" },
    includedFree: { en: "included", es: "incluido" },
  },
  reviews: {
    kicker: { en: "What Cypress says", es: "Lo que dice Cypress" },
    title: { en: "THE REVIEWS ARE IN", es: "YA HABLARON" },
    readAll: { en: "Read every review on Google", es: "Lee todas las reseñas en Google" },
    placeholder: {
      en: "Real Google reviews are being added here.",
      es: "Aquí se están agregando reseñas reales de Google.",
    },
  },
  flavors: {
    kicker: { en: "The lineup", es: "Los sabores" },
    title: { en: "EVERY SINGLE FLAVOR", es: "TODOS LOS SABORES" },
    body: {
      en: "Twelve nieves churned by hand and eighteen raspa flavors. Tap any one of them.",
      es: "Doce nieves batidas a mano y dieciocho sabores de raspa. Toca cualquiera.",
    },
    nieves: { en: "Nieves de Garrafa", es: "Nieves de Garrafa" },
    raspas: { en: "Raspas", es: "Raspas" },
    naturales: { en: "Raspas Naturales", es: "Raspas Naturales" },
    aguas: { en: "Aguas Frescas", es: "Aguas Frescas" },
  },
  about: {
    kicker: { en: "Our story", es: "Nosotros" },
    title: { en: "A LITTLE PIECE OF THE COAST", es: "UN PEDACITO DE LA COSTA" },
    metaTitle: { en: "Our Story", es: "Nosotros" },
    metaDescription: {
      en: "Mango Tropical brings authentic nieve de garrafa, mangonadas and antojitos to Cypress, Texas, made fresh the way they are made back home.",
      es: "Mango Tropical trae nieve de garrafa, mangonadas y antojitos auténticos a Cypress, Texas, hechos frescos como se hacen allá.",
    },
    body: [
      {
        en: "Nieve de garrafa is not ice cream. It is older, simpler and harder to make. A metal drum spins inside a barrel packed with ice and rock salt while somebody stands over it and works the paddle by hand until the fruit turns silky. There is no machine that does it for you and there is no powder that fakes it.",
        es: "La nieve de garrafa no es helado. Es más antigua, más simple y más difícil de hacer. Una garrafa de metal gira dentro de un barril lleno de hielo y sal mientras alguien trabaja la pala a mano hasta que la fruta queda sedosa. No hay máquina que lo haga por ti y no hay polvo que lo imite.",
      },
      {
        en: "That is what Mango Tropical brought to FM 529. Twelve flavors churned the old way, fruit cut the same morning, chamoy poured with a heavy hand, and a shop painted the color of a sunset because a place that serves this should feel like the coast.",
        es: "Eso es lo que Mango Tropical trajo a FM 529. Doce sabores batidos a la antigua, fruta cortada esa misma mañana, chamoy servido sin medirlo, y un local pintado del color de un atardecer, porque un lugar que sirve esto debe sentirse como la costa.",
      },
      {
        en: "Come in on a hot Saturday and you will see the whole thing at once. Kids arguing over raspa flavors, somebody's abuela ordering a nieve de tamarindo, a line for the elote chorreado and a mango the size of a person standing at the counter in sunglasses. That is the shop. Come hungry.",
        es: "Ven un sábado de calor y vas a ver todo junto. Niños peleando por el sabor de la raspa, la abuela de alguien pidiendo nieve de tamarindo, fila para el elote chorreado y un mango del tamaño de una persona parado en el mostrador con lentes de sol. Eso es la tienda. Ven con hambre.",
      },
    ],
    factsTitle: { en: "The short version", es: "La versión corta" },
    facts: [
      {
        label: { en: "What we make", es: "Qué hacemos" },
        value: {
          en: "Nieve de garrafa, mangonadas, raspas, elotes and antojitos",
          es: "Nieve de garrafa, mangonadas, raspas, elotes y antojitos",
        },
      },
      {
        label: { en: "How we make it", es: "Cómo lo hacemos" },
        value: {
          en: "Churned by hand, one hundred percent natural, fruit cut fresh",
          es: "Batido a mano, cien por ciento natural, fruta cortada fresca",
        },
      },
      {
        label: { en: "Where", es: "Dónde" },
        value: { en: "FM 529 at Fry Road, Cypress, Texas", es: "FM 529 y Fry Road, Cypress, Texas" },
      },
      {
        label: { en: "Who it is for", es: "Para quién" },
        value: {
          en: "Families, after school, after dinner, after anything",
          es: "Familias, después de la escuela, después de cenar, después de lo que sea",
        },
      },
    ],
  },
  visit: {
    kicker: { en: "Come see us", es: "Ven a vernos" },
    title: { en: "FM 529 AND FRY ROAD", es: "FM 529 Y FRY ROAD" },
    metaTitle: { en: "Visit Us in Cypress, TX", es: "Visítanos en Cypress, TX" },
    metaDescription: {
      en: "Mango Tropical is at 20400 FM 529, Suite 100, Cypress, TX 77433. Open daily at 11 AM. Directions, hours and phone number.",
      es: "Mango Tropical está en 20400 FM 529, Suite 100, Cypress, TX 77433. Abierto todos los días desde las 11 AM. Ubicación, horario y teléfono.",
    },
    body: {
      en: "We are in the center at FM 529 and Fry Road with parking right out front and a patio for when the weather cooperates. Bring the kids. Bring the whole family. There is a seat outside with your name on it.",
      es: "Estamos en el centro comercial de FM 529 y Fry Road, con estacionamiento enfrente y patio para cuando el clima ayuda. Trae a los niños. Trae a toda la familia. Hay un lugar afuera con tu nombre.",
    },
    addressTitle: { en: "Address", es: "Dirección" },
    hoursTitle: { en: "Hours", es: "Horario" },
    phoneTitle: { en: "Phone", es: "Teléfono" },
    followTitle: { en: "Follow along", es: "Síguenos" },
    directions: { en: "Get directions", es: "Cómo llegar" },
    callUs: { en: "Call us", es: "Llámanos" },
    mapTitle: { en: "Map to Mango Tropical in Cypress, Texas", es: "Mapa a Mango Tropical en Cypress, Texas" },
  },
  faq: {
    kicker: { en: "Questions", es: "Preguntas" },
    title: { en: "GOOD QUESTIONS", es: "BUENAS PREGUNTAS" },
    items: [
      {
        q: { en: "What is a mangonada?", es: "¿Qué es una mangonada?" },
        a: {
          en: "A mangonada is mango nieve or sorbet layered with fresh mango chunks, chamoy, chile powder and a tamarindo stick. It is sweet, sour, salty and a little spicy all at once, and it is the single most ordered thing we make.",
          es: "Una mangonada es nieve o sorbete de mango en capas con trozos de mango fresco, chamoy, chile en polvo y un tamarindo. Es dulce, ácida, salada y un poco picosa al mismo tiempo, y es lo más pedido que hacemos.",
        },
      },
      {
        q: { en: "What is nieve de garrafa?", es: "¿Qué es la nieve de garrafa?" },
        a: {
          en: "Nieve de garrafa is a traditional Mexican ice cream churned by hand in a metal drum surrounded by ice and rock salt. It uses real fruit instead of powders or bases, which is why it tastes cleaner and lighter than regular ice cream.",
          es: "La nieve de garrafa es un helado tradicional mexicano batido a mano en una garrafa de metal rodeada de hielo y sal. Se hace con fruta de verdad en lugar de polvos o bases, por eso sabe más limpia y ligera que el helado normal.",
        },
      },
      {
        q: { en: "What is the difference between a raspa and a raspa natural?", es: "¿Cuál es la diferencia entre una raspa y una raspa natural?" },
        a: {
          en: "A regular raspa is shaved ice with flavored syrup, and it comes in eighteen flavors with one topping included. A raspa natural is made from real fruit blended fresh, in tamarindo, guayaba, piña or chamoyada.",
          es: "Una raspa normal es hielo raspado con jarabe de sabor, viene en dieciocho sabores e incluye un topping. Una raspa natural se hace con fruta de verdad, en tamarindo, guayaba, piña o chamoyada.",
        },
      },
      {
        q: { en: "Do you have anything without chile or chamoy?", es: "¿Tienen algo sin chile ni chamoy?" },
        a: {
          en: "Plenty. Every nieve de garrafa, the fresas con crema, the banana split, the waffle cones, the ice cream floats and all the aguas frescas come without any heat at all. Just tell the counter and they will leave it off anything.",
          es: "Muchísimo. Todas las nieves de garrafa, las fresas con crema, el banana split, los conos de waffle, los helados flotantes y todas las aguas frescas van sin nada de picante. Solo dile al mostrador y lo dejan fuera de lo que sea.",
        },
      },
      {
        q: { en: "Where exactly are you located?", es: "¿Dónde están exactamente?" },
        a: {
          en: "20400 FM 529, Suite 100, Cypress, TX 77433, in the center at FM 529 and Fry Road. There is parking directly in front and a patio outside.",
          es: "20400 FM 529, Suite 100, Cypress, TX 77433, en el centro comercial de FM 529 y Fry Road. Hay estacionamiento justo enfrente y patio afuera.",
        },
      },
      {
        q: { en: "What are your hours?", es: "¿Cuál es su horario?" },
        a: {
          en: "We open at 11 AM every day. We close at 9:30 PM Monday through Thursday, and at 10:30 PM Friday, Saturday and Sunday.",
          es: "Abrimos a las 11 AM todos los días. Cerramos a las 9:30 PM de lunes a jueves, y a las 10:30 PM viernes, sábado y domingo.",
        },
      },
    ],
  },
  footer: {
    hours: { en: "Hours", es: "Horario" },
    find: { en: "Find us", es: "Encuéntranos" },
    explore: { en: "Explore", es: "Explora" },
    rights: { en: "All rights reserved.", es: "Todos los derechos reservados." },
    builtFor: {
      en: "Authentic nieves de garrafa, mangonadas, raspas and antojitos in Cypress, Texas.",
      es: "Auténticas nieves de garrafa, mangonadas, raspas y antojitos en Cypress, Texas.",
    },
  },
  og: {
    headline: {
      en: "MANGONADAS & NIEVES DE GARRAFA",
      es: "MANGONADAS Y NIEVES DE GARRAFA",
    },
    sub: {
      en: "Hand churned, 100% natural, on FM 529",
      es: "Batidas a mano, 100% naturales, en FM 529",
    },
  },
  home: {
    metaTitle: {
      en: "Mangonadas, Nieves de Garrafa & Raspas in Cypress, TX",
      es: "Mangonadas, Nieves de Garrafa y Raspas en Cypress, TX",
    },
    metaDescription: {
      en: "Mango Tropical serves hand churned nieve de garrafa, mangonadas, raspas, elotes and aguas frescas on FM 529 in Cypress, Texas. Open daily at 11 AM.",
      es: "Mango Tropical sirve nieve de garrafa batida a mano, mangonadas, raspas, elotes y aguas frescas en FM 529, Cypress, Texas. Abierto todos los días desde las 11 AM.",
    },
  },
  menuPage: {
    metaTitle: { en: "Full Menu", es: "Menú Completo" },
    metaDescription: {
      en: "The complete Mango Tropical menu: nieves de garrafa, mangonadas, raspas, elotes, loaded fries, floats and aguas frescas, with prices.",
      es: "El menú completo de Mango Tropical: nieves de garrafa, mangonadas, raspas, elotes, papas preparadas, flotantes y aguas frescas, con precios.",
    },
    title: { en: "THE WHOLE MENU", es: "EL MENÚ COMPLETO" },
  },
  notFound: {
    title: { en: "NOTHING HERE", es: "AQUÍ NO HAY NADA" },
    body: {
      en: "That page melted. Try the menu instead.",
      es: "Esa página se derritió. Mejor prueba el menú.",
    },
    cta: { en: "Back to the menu", es: "Volver al menú" },
  },
} as const;

/** Picks the right language out of a { en, es } pair. */
export function t<T extends Record<Locale, string>>(pair: T, locale: Locale): string {
  return pair[locale];
}
