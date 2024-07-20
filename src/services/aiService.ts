import { createOllama } from "ollama-ai-provider";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { relatedSchema } from "../models/schemas";
import type { InfoContent } from "../platforms/webPage";
import tv from "../assets/tv-shows.json";
import type { AiSetting } from "../models/settings/aiSetting";

export class AiService {
  private async getModel() {
    const { provider } = await chrome.storage.sync.get(["provider"]);
    const { settings } = await chrome.storage.sync.get(["settings"]);
    const config: AiSetting = settings[provider];
    if (config.provider === "ollama") {
      const { baseURL, model } = config;
      const ollama = createOllama({
        baseURL: baseURL ?? "http://localhost:11434/api",
      });
      return ollama(model);
    }
    if (config.provider === "openai") {
      const { apiKey, model } = config;
      const openai = createOpenAI({
        compatibility: "strict",
        apiKey: apiKey ?? "",
      });
      return openai(model);
    }
    if (config.provider === "anthropic") {
      const { apiKey, model } = config;
      const antropic = createAnthropic({
        apiKey: apiKey ?? "",
      });
      return antropic(model);
    }
  }

  async isSpoiler(content: InfoContent[]) {
    return this.getPrediction(content);
  }

  private getPrediction = async (content: InfoContent[]) => {
    const text = content
      .map((item) =>
        JSON.stringify({
          title: item.title,
          id: item.id,
        })
      )
      .join("\n");
    const tvShows = tv.map((show) => show.name).join("\n");
    const model = await this.getModel();
    if (!model) {
      throw new Error("Model not found");
    }
    const result = await generateObject({
      model,
      schema: relatedSchema,
      temperature: 0.2,
      prompt: `Para un espectador de la serie "[NOMBRE SERIE]" que navega por YouTube, evalúa la probabilidad de que el siguiente título de video contenga spoilers de la serie. Devuelve un único número entre 0 y 1 en formato JSON, sin explicación adicional.
Definición de spoiler: Información que revela tramas importantes, muertes de personajes, giros argumentales o eventos futuros de la serie.

Listado de series que quiero evitar:

${tvShows}

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

En caso de ambigüedad, evalúa basándote en la relevancia del título para la trama. Si el título no parece tener relación alguna con la serie o su género, asigna un valor cercano a 0.
Título del video (puede ser en inglés, español o bilingüe): 

${text}

Retorna un listado de objetos con la probabilidad de que cada título contenga spoilers de la serie, el id 
Ejemplo:

[{ "probability": 0.8, "name": "House of the Dragon", "id": "idVideo"}]

`,
    });
    return result.object;
  };
}
