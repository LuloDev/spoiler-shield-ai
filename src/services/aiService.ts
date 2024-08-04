import { createOllama } from "ollama-ai-provider";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { relatedSchema } from "../models/schemas";
import type { InfoContent } from "../platforms/webPage";
import type { AiSetting } from "../models/settings/aiSetting";
import type { ResultTv } from "src/models/tmdb/tmdbSearch";

export class AiService {
  private async getModel() {
    const { settings } = await chrome.storage.sync.get(["settings"]);
    const config: AiSetting = settings;
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
    const { tvShows: tv } = await chrome.storage.sync.get("tvShows");
    const tvShows = tv
      .map((show: ResultTv) => `${show.name} (${show.original_name})`)
      .join("\n");
    const model = await this.getModel();
    if (!model) {
      throw new Error("Model not found");
    }
    const result = await generateObject({
      model,
      schema: relatedSchema,
      system:
        "You are an AI assistant tasked with evaluating YouTube video titles for potential spoilers of specific TV shows. Follow these instructions:" +
        " 1. Read the title of the video and the name of the TV show." +
        " 2. You will be given a list of TV shows to avoid spoilers for, and a YouTube video title." +
        " 3. For each show in the list, assess the probability that the given title contains spoilers, using a scale from 0 to 1." +
        " 4. Return a JSON array of objects, each containing: " +
        '   "probability": A number between 0 and 1' +
        '   "name": The name of the TV show' +
        '   "id": The ID of the video (which will be provided in the input)' +
        "  Use this probability guide:" +
        "   1.0: Almost certainly contains major spoilers" +
        "   0.8: High probability of spoilers" +
        "   0.5: Moderate possibility of spoilers" +
        "   0.2: Low probability of spoilers" +
        "   0.0: Definitely not related to the show" +
        " 5. Definition of a spoiler: Information revealing important plot points, character deaths, plot twists, or future events of the show." +
        " 6. In case of ambiguity, evaluate based on the title's relevance to the plot. If the title seems unrelated to the show or its genre, assign a value close to 0. " +
        " 7. The video title may be in English, Spanish, or bilingual. Analyze accordingly. " +
        " 8. Important Do not provide any additional explanation. Only return the JSON array." +
        " Example input:" +
        `   TV Shows: ["Game of Thrones", "Breaking Bad", "Stranger Things"]` +
        `   Video title: "The Red Wedding: A Song of Ice and Fire's Most Shocking Moment", Video ID: "abc123"` +
        ' Example output: [{"probability": 1.0, "name": "Game of Thrones", "id": "abc123"},{"probability": 0.0, "name": "Breaking Bad", "id": "abc123"},{"probability": 0.0, "name": "Stranger Things", "id": "abc123"}]' +
        " Example of spoiler detection" +
        ` "Breaking Bad: Walter White's Final Fate Revealed" - 1.0 (Direct spoiler about the series finale)` +
        ` "Breaking Bad: The Science of Methamphetamine" - 0.5 (Mentions the show but not a spoiler)"` +
        ` "Theories About the Next Season of Stranger Things" - 0.7 (Possible spoilers based on speculation)` +
        ' "Interview with The Mandalorian Cast About Filming" - 0.3 (Low risk of spoilers, but could reveal indirect information)' +
        ` "Top 10 Most Shocking Moments in Game of Thrones" - 0.9 (High probability of major spoilers)` +
        ` "Costume Analysis in Bridgerton" - 0.2 (Unlikely to reveal important plot points)` +
        ` "The Witcher: Who is Geralt of Rivia Really?" - 0.6 (Moderate possibility of character spoilers)` +
        ` "New Squid Game Season 2 Trailer Analyzed Frame by Frame" - 0.8 (High probability of revealing information about the upcoming season)`,
      temperature: 0.2,
      prompt:
        `TV Shows to search spoilers: ${tvShows}\n` +
        `Video titles to search spoilers: ${text}\n`,
    });
    return result.object;
  };
}
