import axios from "axios";

export class TmbdApiService {
  private readonly apiKey: string;

  constructor() {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    this.apiKey = apiKey;
  }

  getClient() {
    return axios.create({
      baseURL: "https://api.themoviedb.org/3",
      params: {
        api_key: this.apiKey,
      },
    });
  }

  async searchTvShow(query: string) {
    const client = this.getClient();
    return client.get(`/search/tv`, {
      params: {
        query,
      },
    });
  }
}
