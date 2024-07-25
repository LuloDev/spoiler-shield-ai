import axios from "axios";
import type { TmdbResult } from "../models/tmdb/tmdbSearch";

export class TmbdApiService {
  private readonly apiKey: string;

  constructor() {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    this.apiKey = apiKey;
  }

  private getClient() {
    return axios.create({
      baseURL: "https://api.themoviedb.org/3",
      params: {
        api_key: this.apiKey,
      },
    });
  }

  async searchTvShow(
    query: string,
    language: string = navigator.language
  ): Promise<TmdbResult> {
    try {
      const client = this.getClient();
      const result = await client.get(`/search/tv`, {
        params: {
          query,
          language,
        },
      });
      return result.data;
    } catch (error) {
      console.error("Error in searchTvShow", error);
      return { results: [], total_results: 0, total_pages: 0, page: 0 };
    }
  }
}
