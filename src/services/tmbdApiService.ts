import axios from "axios";
import type {
  ResultMovie,
  ResultTv,
  TmdbResult,
} from "../models/tmdb/tmdbSearch";

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
  ): Promise<TmdbResult<ResultTv>> {
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
      return { results: [], total_results: 0, total_pages: 0, page: 0 };
    }
  }

  async searchMovie(
    query: string,
    language: string = navigator.language
  ): Promise<TmdbResult<ResultMovie>> {
    try {
      const client = this.getClient();
      const result = await client.get(`/search/movie`, {
        params: {
          query,
          language,
        },
      });
      return result.data;
    } catch (error) {
      return { results: [], total_results: 0, total_pages: 0, page: 0 };
    }
  }
}
