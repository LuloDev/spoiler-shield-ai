export type TmdbResult = {
  page: number;
  results: ResultTv[];
  total_pages: number;
  total_results: number;
};

export type ResultTv = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: Date;
  name: string;
  vote_average: number;
  vote_count: number;
};
