import { createOllama } from "ollama-ai-provider";
import { generateObject } from "ai";
import tv from "../assets/tv-shows.json";
import { relatedSchema, predictionSchema } from "../models/schemas";

const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});
const model = ollama("llama3");

export const isRelatedToTvShow = async (title: string) => {
  const result = await generateObject({
    model,
    schema: relatedSchema,
    temperature: 0.2,
    prompt: `
      Para un espectador que navega por YouTube, evalúa la probabilidad de que el siguiente título de video esté relacionado con la serie o pelicula. Devuelve un único número entre 0 y 1 en formato JSON, con el nombre.

      Ejemplos de calibración:
      "House of the Dragon: ¡La muerte de [NOMBRE] explicada!" - 1.0
      "THE BOYS | ANÁLISIS, EXPLICACIÓN y TEORÍAS del 4x07: Todo Va a Explotar" - 1.0
      "THE BOYS: TODO lo que NO VISTE en el Capitulo 7 | Referencias, guiños, detalles y más" - 1.0
      "¿Por qué Walter dejó el Libro en su baño? Breaking Bad" - 1.0
      "Teorías sobre el futuro de House of the Dragon" - 0.7
      "Reparto de House of the Dragon habla sobre la filmación" - 0.3
      "Reseña de juegos de estrategia medieval" - 0.1
      "El simulador de DETECTIVE CORRUPTO - Shadows of Doubt" - 0.0
      "Top 10 Trending GitHub Projects 2024 | AI, Automation, Agent-E & More" - 0.0
      "¡Mira este video de gatitos!" - 0.0
      "No Somos Polvo de Estrellas" - 0.0

      En caso de ambigüedad, evalúa basándote en la relevancia del título para la serie o película. Si el título no parece tener relación alguna con la serie o película, asigna un valor cercano a 0.

      El espectador aun no ha terminado de ver las siguientes series:

      ${tv.map((show) => "- " + show.name).join("\n")}

      Título del video (puede ser en inglés, español o bilingüe): ${title}

    `,
  });
  return result.object;
};

export const getPrediction = async (title: string) => {
  const result = await generateObject({
    model,
    schema: predictionSchema,
    temperature: 0.2,
    prompt: `Para un espectador de la serie "[NOMBRE SERIE]" que navega por YouTube, evalúa la probabilidad de que el siguiente título de video contenga spoilers de la serie. Devuelve un único número entre 0 y 1 en formato JSON, sin explicación adicional.
Definición de spoiler: Información que revela tramas importantes, muertes de personajes, giros argumentales o eventos futuros de la serie.

Guía de interpretación:
1.0: Casi seguro que contiene spoilers importantes [NOMBRE SERIE]
0.8: Alta probabilidad de contener spoilers de [NOMBRE SERIE]
0.5: Posibilidad moderada de spoilers [NOMBRE SERIE]
0.2: Baja probabilidad de spoilers [NOMBRE SERIE]
0.0: Definitivamente no relacionado con la serie [NOMBRE SERIE]

Ejemplos de calibración:
"House of the Dragon: ¡La muerte de [NOMBRE] explicada!" - 1.0
"Teorías sobre el futuro de House of the Dragon" - 0.7
"Reparto de House of the Dragon habla sobre la filmación" - 0.3
"Reseña de juegos de estrategia medieval" - 0.1
"El simulador de DETECTIVE CORRUPTO - Shadows of Doubt" - 0.0
"Top 10 Trending GitHub Projects 2024 | AI, Automation, Agent-E & More" - 0.0
"¡Mira este video de gatitos!" - 0.0
"No Somos Polvo de Estrellas" - 0.0

En caso de ambigüedad, evalúa basándote en la relevancia del título para la trama de "House of the Dragon". Si el título no parece tener relación alguna con la serie o su género, asigna un valor cercano a 0.
Título del video (puede ser en inglés, español o bilingüe): ${title}
`,
  });
  return result.object;
};
