/**
 * The complete menu, transcribed from the printed menu the shop uses in store.
 * Prices are the printed ones. Every item carries its own description because
 * each category renders as its own indexable landing page.
 */

export type Locale = "en" | "es";
export type Text = Record<Locale, string>;

export type Price = { label: Text; amount: number };

export type MenuItem = {
  slug: string;
  name: Text;
  description: Text;
  image?: string;
  prices: Price[];
  seasonal?: boolean;
};

export type MenuSection = {
  slug: string;
  title: Text;
  note?: Text;
  items: MenuItem[];
  flavors?: Text[];
};

export type MenuCategory = {
  slug: string;
  name: Text;
  /** Short line used on cards and in navigation. */
  kicker: Text;
  /** Long copy that opens the category landing page. Written for search. */
  intro: Text;
  metaTitle: Text;
  metaDescription: Text;
  image: string;
  accent: "orange" | "magenta" | "blue" | "lime" | "yellow";
  sections: MenuSection[];
};

const oz = (n: number): Text => ({ en: `${n} oz`, es: `${n} oz` });
const flat: Text = { en: "Each", es: "Cada uno" };

export const menu: MenuCategory[] = [
  {
    slug: "mangonadas",
    name: { en: "Mangonadas & Fruit Snacks", es: "Mangonadas y Antojitos con Fruta" },
    kicker: { en: "Chamoy, chile and fresh fruit", es: "Chamoy, chile y fruta fresca" },
    intro: {
      en: "This is the section people drive across Cypress for. Fresh fruit, house nieve, a heavy pour of chamoy and a tamarindo stick standing straight up out of the cup. Sweet, sour, salty and spicy all fighting for the same spoonful, exactly the way it should be.",
      es: "Esta es la sección por la que la gente cruza todo Cypress. Fruta fresca, nieve de la casa, chamoy sin medirlo y un tamarindo parado en medio del vaso. Dulce, ácido, salado y picoso peleando por la misma cucharada, tal como debe ser.",
    },
    metaTitle: {
      en: "Mangonadas in Cypress, TX",
      es: "Mangonadas en Cypress, TX",
    },
    metaDescription: {
      en: "Fresh mangonadas, pepinadas and fruit cups made with real fruit, chamoy and chile at Mango Tropical on FM 529 in Cypress, Texas.",
      es: "Mangonadas, pepinadas y cocteles de fruta hechos con fruta natural, chamoy y chile en Mango Tropical, FM 529, Cypress, Texas.",
    },
    image: "/menu/mangonada-tropical.webp",
    accent: "orange",
    sections: [
      {
        slug: "antojitos-con-fruta",
        title: { en: "Fruit Snacks", es: "Antojitos con Fruta" },
        items: [
          {
            slug: "mangonada-tropical",
            name: { en: "Mangonada Tropical", es: "Mangonada Tropical" },
            description: {
              en: "The one that started it all. Mango nieve layered with fresh mango chunks, chamoy, chile powder and a tamarindo stick.",
              es: "La que empezó todo. Nieve de mango en capas con trozos de mango fresco, chamoy, chile en polvo y un tamarindo.",
            },
            image: "/menu/mangonada-tropical.webp",
            prices: [{ label: oz(16), amount: 8.5 }],
          },
          {
            slug: "pepinada-tropical",
            name: { en: "Pepinada Tropical", es: "Pepinada Tropical" },
            description: {
              en: "Cool cucumber and lime nieve loaded with crisp cucumber, chamoy and chile. The one that wakes your whole mouth up.",
              es: "Nieve fresca de pepino y limón cargada de pepino crujiente, chamoy y chile. La que despierta todo el paladar.",
            },
            image: "/menu/pepinada-tropical.webp",
            prices: [{ label: oz(16), amount: 8.5 }],
          },
          {
            slug: "sandia-tropical",
            name: { en: "Sandía Tropical", es: "Sandía Tropical" },
            description: {
              en: "Watermelon nieve packed with fresh watermelon, chamoy, chile and a tamarindo stick. Summer in a cup, year round.",
              es: "Nieve de sandía con sandía fresca, chamoy, chile y tamarindo. Verano en un vaso, todo el año.",
            },
            image: "/menu/sandia-tropical.webp",
            prices: [{ label: oz(16), amount: 8.5 }],
          },
          {
            slug: "raspa-tropical",
            name: { en: "Raspa Tropical", es: "Raspa Tropical" },
            description: {
              en: "Shaved ice buried under fresh fruit, chamoy and chile. Lighter than a mangonada, just as loud.",
              es: "Raspa cubierta de fruta fresca, chamoy y chile. Más ligera que una mangonada, igual de escandalosa.",
            },
            image: "/menu/raspa-tropical.webp",
            prices: [
              { label: oz(12), amount: 7.5 },
              { label: oz(16), amount: 8.5 },
            ],
          },
          {
            slug: "fresas-con-crema",
            name: { en: "Fresas con Crema", es: "Fresas con Crema" },
            description: {
              en: "Strawberries and sweet cream, piled high with whipped cream and a whole strawberry on top. No chile, no chamoy, no argument.",
              es: "Fresas con crema dulce, coronadas con crema batida y una fresa entera. Sin chile, sin chamoy, sin discusión.",
            },
            image: "/menu/fresas-con-crema.webp",
            prices: [
              { label: oz(12), amount: 7.25 },
              { label: oz(16), amount: 9.5 },
            ],
          },
          {
            slug: "coctel-de-frutas",
            name: { en: "Coctel de Frutas", es: "Coctel de Frutas" },
            description: {
              en: "A full cup of fresh cut pineapple, mango, watermelon, cucumber and jicama with lime, chile and chamoy on request.",
              es: "Un vaso lleno de piña, mango, sandía, pepino y jícama recién cortados, con limón, chile y chamoy si lo pides.",
            },
            image: "/menu/coctel-de-frutas.webp",
            prices: [{ label: flat, amount: 7.75 }],
          },
          {
            slug: "banana-split",
            name: { en: "Banana Split", es: "Banana Split" },
            description: {
              en: "Three scoops of nieve down a split banana with whipped cream, sprinkles and a cherry. Built to share, usually isn't.",
              es: "Tres bolas de nieve sobre un plátano abierto, con crema batida, chispas y una cereza. Hecho para compartir, casi nunca se comparte.",
            },
            image: "/menu/banana-split.webp",
            prices: [{ label: flat, amount: 9.5 }],
          },
        ],
      },
    ],
  },
  {
    slug: "nieves-de-garrafa",
    name: { en: "Nieves de Garrafa", es: "Nieves de Garrafa" },
    kicker: { en: "Churned by hand, 100% natural", es: "Batidas a mano, 100% naturales" },
    intro: {
      en: "Nieve de garrafa is made the old way, churned by hand in a metal drum packed with ice and salt until it turns silky. No powders, no bases, no shortcuts. Twelve flavors, four sizes, and a waffle cone if you want one.",
      es: "La nieve de garrafa se hace a la antigua, batida a mano en una garrafa rodeada de hielo y sal hasta quedar sedosa. Sin polvos, sin bases, sin atajos. Doce sabores, cuatro tamaños, y cono de waffle si lo quieres.",
    },
    metaTitle: {
      en: "Nieves de Garrafa in Cypress, TX",
      es: "Nieves de Garrafa en Cypress, TX",
    },
    metaDescription: {
      en: "Hand churned nieve de garrafa in twelve natural flavors including mango, tamarindo, guayaba and coco. Mango Tropical, FM 529, Cypress, Texas.",
      es: "Nieve de garrafa batida a mano en doce sabores naturales: mango, tamarindo, guayaba, coco y más. Mango Tropical, FM 529, Cypress, Texas.",
    },
    image: "/menu/nieve-mango.webp",
    accent: "yellow",
    sections: [
      {
        slug: "nieves",
        title: { en: "By the Cup", es: "Por Vaso" },
        note: {
          en: "Every flavor is available in all four sizes.",
          es: "Todos los sabores están disponibles en los cuatro tamaños.",
        },
        flavors: [
          { en: "Mango", es: "Mango" },
          { en: "Mangonada", es: "Mangonada" },
          { en: "Limón", es: "Limón" },
          { en: "Tamarindo", es: "Tamarindo" },
          { en: "Guayaba", es: "Guayaba" },
          { en: "Coco", es: "Coco" },
          { en: "Mexican Vainilla", es: "Vainilla Mexicana" },
          { en: "Gringa Vainilla", es: "Vainilla Gringa" },
          { en: "Fresa", es: "Fresa" },
          { en: "Chocolate", es: "Chocolate" },
          { en: "Cookies & Cream", es: "Cookies & Cream" },
          { en: "Bubble Gum", es: "Bubble Gum" },
        ],
        items: [
          {
            slug: "nieve-vaso",
            name: { en: "Nieve de Garrafa", es: "Nieve de Garrafa" },
            description: {
              en: "Pick any of the twelve flavors. Mix two in the same cup if you cannot decide, nobody here will stop you.",
              es: "Escoge cualquiera de los doce sabores. Mezcla dos en el mismo vaso si no te decides, aquí nadie te va a detener.",
            },
            image: "/menu/nieve-mango.webp",
            prices: [
              { label: oz(8), amount: 5.5 },
              { label: oz(12), amount: 6.5 },
              { label: oz(16), amount: 7.5 },
              { label: oz(32), amount: 13.5 },
            ],
          },
          {
            slug: "waffle-cone",
            name: { en: "Waffle Cone", es: "Cono de Waffle" },
            description: {
              en: "Two scoops in a fresh waffle cone. Sprinkles are free, judgment is not included.",
              es: "Dos bolas en un cono de waffle recién hecho. Las chispas van gratis.",
            },
            image: "/menu/waffle-cone.webp",
            prices: [{ label: flat, amount: 6.25 }],
          },
          {
            slug: "canasta-waffle",
            name: { en: "Canasta Waffle", es: "Canasta Waffle" },
            description: {
              en: "A waffle bowl loaded with scoops, whipped cream and a cherry. More room means more scoops.",
              es: "Una canasta de waffle llena de bolas, crema batida y una cereza. Más espacio significa más nieve.",
            },
            image: "/menu/canasta-waffle.webp",
            prices: [{ label: flat, amount: 7.75 }],
          },
        ],
      },
      {
        slug: "antojitos-de-nieve",
        title: { en: "Ice Cream Snacks", es: "Antojitos de Nieve" },
        items: [
          {
            slug: "chocolate-delight",
            name: { en: "Chocolate Delight", es: "Chocolate Delight" },
            description: {
              en: "Chocolate nieve under whipped cream, chocolate sprinkles, a wafer roll and a cherry.",
              es: "Nieve de chocolate con crema batida, chispas de chocolate, barquillo y cereza.",
            },
            image: "/menu/chocolate-delight.webp",
            prices: [{ label: flat, amount: 7.75 }],
          },
          {
            slug: "strawberry-delight",
            name: { en: "Strawberry Delight", es: "Strawberry Delight" },
            description: {
              en: "Strawberry nieve ringed with fresh strawberries and finished with lechera.",
              es: "Nieve de fresa rodeada de fresas frescas y bañada en lechera.",
            },
            image: "/menu/strawberry-delight.webp",
            prices: [{ label: flat, amount: 7.75 }],
          },
          {
            slug: "banana-royale",
            name: { en: "Banana Royale", es: "Banana Royale" },
            description: {
              en: "Vanilla nieve with fresh banana, caramel, peanuts, whipped cream and a waffle wafer.",
              es: "Nieve de vainilla con plátano fresco, caramelo, cacahuates, crema batida y galleta de waffle.",
            },
            image: "/menu/banana-royale.webp",
            prices: [{ label: flat, amount: 7.75 }],
          },
          {
            slug: "gansito-nieve",
            name: { en: "Gansito Nieve", es: "Gansito Nieve" },
            description: {
              en: "A whole Gansito standing in vanilla nieve with strawberries and chocolate syrup.",
              es: "Un Gansito entero parado en nieve de vainilla con fresas y jarabe de chocolate.",
            },
            image: "/menu/gansito-nieve.webp",
            prices: [{ label: flat, amount: 7.5 }],
          },
          {
            slug: "conchi-nieve",
            name: { en: "Conchi Nieve", es: "Conchi Nieve" },
            description: {
              en: "A fresh concha split and stuffed with nieve, whipped cream, strawberries and caramel. The best idea on the menu.",
              es: "Una concha abierta y rellena de nieve, crema batida, fresas y caramelo. La mejor idea del menú.",
            },
            image: "/menu/conchi-nieve.webp",
            prices: [{ label: flat, amount: 7.5 }],
          },
        ],
      },
    ],
  },
  {
    slug: "raspas",
    name: { en: "Raspas & Snowballs", es: "Raspas y Snowballs" },
    kicker: { en: "Eighteen flavors, one free topping", es: "Dieciocho sabores, un topping gratis" },
    intro: {
      en: "Shaved so fine it disappears on your tongue, then soaked in flavor all the way to the bottom of the cup. Eighteen flavors on the regular raspas and every size includes one topping. If you want the real thing, order a Raspa Natural made from actual fruit.",
      es: "Raspada tan fina que se deshace en la lengua, y con sabor hasta el fondo del vaso. Dieciocho sabores en las raspas normales y todos los tamaños incluyen un topping. Si quieres lo auténtico, pide una Raspa Natural hecha con fruta de verdad.",
    },
    metaTitle: {
      en: "Raspas & Snowballs in Cypress, TX",
      es: "Raspas y Snowballs en Cypress, TX",
    },
    metaDescription: {
      en: "Shaved ice raspas and snowballs in eighteen flavors, plus natural raspas made with real tamarindo, guayaba and piña. Cypress, Texas.",
      es: "Raspas y snowballs en dieciocho sabores, además de raspas naturales de tamarindo, guayaba y piña. Cypress, Texas.",
    },
    image: "/menu/raspas-trio.webp",
    accent: "blue",
    sections: [
      {
        slug: "raspas-snowballs",
        title: { en: "Raspas / Snowballs", es: "Raspas / Snowballs" },
        note: {
          en: "Every size includes one topping.",
          es: "Todos los tamaños incluyen un topping.",
        },
        flavors: [
          { en: "Banana", es: "Plátano" },
          { en: "Bubble Gum", es: "Bubble Gum" },
          { en: "Cherry", es: "Cereza" },
          { en: "Coconut (White or Blue)", es: "Coco (Blanco o Azul)" },
          { en: "Horchata", es: "Horchata" },
          { en: "Ice Cream", es: "Ice Cream" },
          { en: "Mango", es: "Mango" },
          { en: "Piccadilly", es: "Piccadilly" },
          { en: "Watermelon", es: "Sandía" },
          { en: "Pineapple", es: "Piña" },
          { en: "Piña Colada", es: "Piña Colada" },
          { en: "Leche", es: "Leche" },
          { en: "Lemon Lime", es: "Limón" },
          { en: "Raspberry (Red or Blue)", es: "Frambuesa (Roja o Azul)" },
          { en: "Strawberry", es: "Fresa" },
          { en: "Strawberry Cheesecake", es: "Strawberry Cheesecake" },
          { en: "Tiger's Blood", es: "Tiger's Blood" },
          { en: "Wedding Cake", es: "Wedding Cake" },
        ],
        items: [
          {
            slug: "raspa",
            name: { en: "Raspa", es: "Raspa" },
            description: {
              en: "Pick a flavor, pick a size, pick your free topping. Then come back tomorrow and pick a different one.",
              es: "Escoge sabor, tamaño y tu topping gratis. Mañana regresas y escoges otro.",
            },
            image: "/menu/raspas-trio.webp",
            prices: [
              { label: { en: "Small, 12 oz", es: "Chica, 12 oz" }, amount: 4.75 },
              { label: { en: "Medium, 16 oz", es: "Mediana, 16 oz" }, amount: 5.75 },
              { label: { en: "Large, 24 oz", es: "Grande, 24 oz" }, amount: 7.75 },
            ],
          },
        ],
      },
      {
        slug: "raspas-naturales",
        title: { en: "Raspas Naturales", es: "Raspas Naturales" },
        note: {
          en: "Made from real fruit, not syrup.",
          es: "Hechas con fruta de verdad, no con jarabe.",
        },
        flavors: [
          { en: "Tamarindo", es: "Tamarindo" },
          { en: "Guayaba", es: "Guayaba" },
          { en: "Piña", es: "Piña" },
          { en: "Chamoyada", es: "Chamoyada" },
        ],
        items: [
          {
            slug: "raspa-natural",
            name: { en: "Raspa Natural", es: "Raspa Natural" },
            description: {
              en: "The upgrade. Real tamarindo, guayaba or piña, blended fresh. The chamoyada is the one to beat.",
              es: "El upgrade. Tamarindo, guayaba o piña de verdad, hechos frescos. La chamoyada es la que hay que vencer.",
            },
            prices: [
              { label: { en: "Small, 12 oz", es: "Chica, 12 oz" }, amount: 6.25 },
              { label: { en: "Medium, 16 oz", es: "Mediana, 16 oz" }, amount: 7.5 },
              { label: { en: "Large, 24 oz", es: "Grande, 24 oz" }, amount: 9.25 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "antojitos",
    name: { en: "Elotes, Fries & Nachos", es: "Elotes, Papas y Nachos" },
    kicker: { en: "The savory side", es: "El lado salado" },
    intro: {
      en: "Nobody comes in for just dessert. Elote in a cup drowned in crema, cheese and chile. Elote chorreado built on a bed of Hot Cheetos. Fries under chili and cheese. Order something salty first and you will enjoy the nieve twice as much.",
      es: "Nadie viene solo por el postre. Elote en vaso ahogado en crema, queso y chile. Elote chorreado sobre una cama de Hot Cheetos. Papas bajo chili y queso. Pide algo salado primero y la nieve te va a saber al doble.",
    },
    metaTitle: {
      en: "Elotes, Loaded Fries & Nachos in Cypress, TX",
      es: "Elotes, Papas y Nachos en Cypress, TX",
    },
    metaDescription: {
      en: "Elote en vaso, elote chorreado, salchipapas, chili cheese fries, loaded nachos and funnel cake at Mango Tropical in Cypress, Texas.",
      es: "Elote en vaso, elote chorreado, salchipapas, papas con chili y queso, nachos y funnel cake en Mango Tropical, Cypress, Texas.",
    },
    image: "/menu/elote-chorreado.webp",
    accent: "lime",
    sections: [
      {
        slug: "antojitos-de-comida",
        title: { en: "Food Snacks", es: "Antojitos de Comida" },
        items: [
          {
            slug: "elote-chorreado",
            name: { en: "Elote Chorreado", es: "Elote Chorreado" },
            description: {
              en: "A full elote in a cup planted in the middle of Hot Cheetos, nacho cheese, crema, queso fresco and chamoy. The most photographed thing in the building.",
              es: "Un elote en vaso completo, plantado en medio de Hot Cheetos, queso nacho, crema, queso fresco y chamoy. Lo más fotografiado del local.",
            },
            image: "/menu/elote-chorreado.webp",
            prices: [{ label: flat, amount: 9.5 }],
          },
          {
            slug: "elote-en-vaso",
            name: { en: "Elote en Vaso", es: "Elote en Vaso" },
            description: {
              en: "Sweet corn, crema, queso fresco, chile, chamoy and a wedge of lime. The classic, done right.",
              es: "Elote dulce, crema, queso fresco, chile, chamoy y un limón. El clásico, bien hecho.",
            },
            image: "/menu/elote-en-vaso.webp",
            prices: [{ label: flat, amount: 6.75 }],
          },
          {
            slug: "salchipapas",
            name: { en: "Salchipapas", es: "Salchipapas" },
            description: {
              en: "Fries and sausage under crema, cheese, mustard and a whole jalapeño for whoever is brave.",
              es: "Papas con salchicha bajo crema, queso, mostaza y un jalapeño entero para el valiente.",
            },
            image: "/menu/salchipapas.webp",
            prices: [{ label: flat, amount: 6.75 }],
          },
          {
            slug: "chili-cheese-fries",
            name: { en: "Chili Cheese Fries", es: "Papas con Chili y Queso" },
            description: {
              en: "Hot fries buried under chili and nacho cheese. Exactly what it says.",
              es: "Papas calientes bajo chili y queso nacho. Exactamente lo que dice.",
            },
            image: "/menu/chili-cheese-fries.webp",
            prices: [{ label: flat, amount: 6.75 }],
          },
          {
            slug: "loaded-nachos",
            name: { en: "Loaded Nachos", es: "Nachos Preparados" },
            description: {
              en: "Chips, nacho cheese, chili and as many jalapeños as the tray will hold.",
              es: "Totopos, queso nacho, chili y todos los jalapeños que aguante la charola.",
            },
            image: "/menu/loaded-nachos.webp",
            prices: [{ label: flat, amount: 6.75 }],
          },
          {
            slug: "nachos",
            name: { en: "Nachos", es: "Nachos" },
            description: {
              en: "Chips and nacho cheese. Nothing else, nothing missing.",
              es: "Totopos y queso nacho. Nada más, nada de menos.",
            },
            prices: [{ label: { en: "Cheese only", es: "Solo queso" }, amount: 5.75 }],
          },
          {
            slug: "solo-fries",
            name: { en: "Solo Fries", es: "Papas Solas" },
            description: {
              en: "Just fries, hot and salted.",
              es: "Solo papas, calientes y con sal.",
            },
            prices: [{ label: flat, amount: 5.5 }],
          },
          {
            slug: "funnel-cake",
            name: { en: "Funnel Cake", es: "Funnel Cake" },
            description: {
              en: "Fried fresh and buried in powdered sugar. Seasonal, so ask when you see it.",
              es: "Frito al momento y cubierto de azúcar glas. De temporada, así que pregunta cuando lo veas.",
            },
            seasonal: true,
            prices: [{ label: flat, amount: 9.5 }],
          },
          {
            slug: "carnival-funnel-cake",
            name: { en: "Carnival Funnel Cake", es: "Funnel Cake Carnival" },
            description: {
              en: "Funnel cake with nieve on top. The fairground version, indoors, with air conditioning.",
              es: "Funnel cake con nieve encima. La versión de feria, bajo techo y con aire acondicionado.",
            },
            seasonal: true,
            prices: [{ label: { en: "Includes ice cream", es: "Incluye nieve" }, amount: 11.5 }],
          },
        ],
      },
    ],
  },
  {
    slug: "bebidas",
    name: { en: "Floats & Drinks", es: "Flotantes y Bebidas" },
    kicker: { en: "Aguas frescas and ice cream floats", es: "Aguas frescas y helados flotantes" },
    intro: {
      en: "Aguas frescas made fresh daily in limón, horchata and jamaica. Ice cream floats built with a full scoop of nieve. Agua mineral preparada and rusas if you want something with a kick of lime and salt.",
      es: "Aguas frescas hechas a diario de limón, horchata y jamaica. Helados flotantes con una bola completa de nieve. Agua mineral preparada y rusas si quieres algo con limón y sal.",
    },
    metaTitle: {
      en: "Aguas Frescas & Ice Cream Floats in Cypress, TX",
      es: "Aguas Frescas y Helados Flotantes en Cypress, TX",
    },
    metaDescription: {
      en: "Fresh aguas frescas in horchata, limón and jamaica, ice cream floats, agua mineral preparada and rusas. Mango Tropical, Cypress, Texas.",
      es: "Aguas frescas de horchata, limón y jamaica, helados flotantes, agua mineral preparada y rusas. Mango Tropical, Cypress, Texas.",
    },
    image: "/menu/helados-flotantes.webp",
    accent: "magenta",
    sections: [
      {
        slug: "helados-flotantes",
        title: { en: "Ice Cream Floats", es: "Helados Flotantes" },
        items: [
          {
            slug: "float",
            name: { en: "Ice Cream Float", es: "Helado Flotante" },
            description: {
              en: "Coke, Squirt or Fanta with a full scoop of nieve floating on top.",
              es: "Coca, Squirt o Fanta con una bola completa de nieve flotando encima.",
            },
            image: "/menu/helados-flotantes.webp",
            prices: [{ label: { en: "Coke, Squirt or Fanta", es: "Coca, Squirt o Fanta" }, amount: 6.75 }],
          },
        ],
      },
      {
        slug: "aguas-frescas",
        title: { en: "Aguas Frescas Naturales", es: "Aguas Frescas Naturales" },
        flavors: [
          { en: "Limón", es: "Limón" },
          { en: "Horchata", es: "Horchata" },
          { en: "Jamaica", es: "Jamaica" },
        ],
        items: [
          {
            slug: "agua-fresca",
            name: { en: "Agua Fresca", es: "Agua Fresca" },
            description: {
              en: "Made fresh every day. Limón, horchata or jamaica, poured cold over ice.",
              es: "Hechas frescas todos los días. Limón, horchata o jamaica, bien frías.",
            },
            prices: [{ label: oz(32), amount: 5.75 }],
          },
        ],
      },
      {
        slug: "bebidas",
        title: { en: "Drinks", es: "Bebidas" },
        items: [
          {
            slug: "rusa-preparada",
            name: { en: "Rusa Preparada", es: "Rusa Preparada" },
            description: {
              en: "Squirt, lime, salt and chamoy on the rim. The Mexican answer to a hot afternoon.",
              es: "Squirt, limón, sal y chamoy en el borde. La respuesta mexicana a una tarde de calor.",
            },
            prices: [{ label: flat, amount: 7.5 }],
          },
          {
            slug: "agua-mineral-preparada",
            name: { en: "Agua Mineral Preparada", es: "Agua Mineral Preparada" },
            description: {
              en: "Mineral water prepared with lime, salt and chamoy.",
              es: "Agua mineral preparada con limón, sal y chamoy.",
            },
            prices: [{ label: flat, amount: 6.5 }],
          },
          {
            slug: "topo-chico",
            name: { en: "Topo Chico", es: "Topo Chico" },
            description: { en: "Ice cold, in the glass bottle.", es: "Bien fría, en botella de vidrio." },
            prices: [{ label: flat, amount: 3.75 }],
          },
          {
            slug: "sodas",
            name: { en: "Sodas & Bottled Water", es: "Refrescos y Agua Embotellada" },
            description: {
              en: "Coke, Sprite, Squirt, Fanta or bottled water.",
              es: "Coca, Sprite, Squirt, Fanta o agua embotellada.",
            },
            prices: [{ label: flat, amount: 2.5 }],
          },
        ],
      },
    ],
  },
];

export const TOPPING_PRICE = 0.75;

export const toppings: Text[] = [
  { en: "Chile / Chamoy", es: "Chile / Chamoy" },
  { en: "Lechera", es: "Lechera" },
  { en: "Peanuts", es: "Cacahuates" },
  { en: "Gummy Bears", es: "Gomitas de Oso" },
  { en: "Sour Worms", es: "Gusanos Ácidos" },
  { en: "Sprinkles", es: "Chispas" },
  { en: "Chocolate", es: "Chocolate" },
  { en: "Strawberry", es: "Fresa" },
  { en: "Caramel Syrup", es: "Jarabe de Caramelo" },
  { en: "Whipped Cream", es: "Crema Batida" },
];

export function findCategory(slug: string) {
  return menu.find((c) => c.slug === slug);
}

export const categorySlugs = menu.map((c) => c.slug);

export function money(amount: number) {
  return `$${amount.toFixed(2)}`;
}

/** Every priced line on the menu, used to build the Menu schema. */
export function allItems() {
  return menu.flatMap((c) =>
    c.sections.flatMap((s) => s.items.map((i) => ({ category: c, section: s, item: i }))),
  );
}
