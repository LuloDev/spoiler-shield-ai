type BaseSetting = {
  name: string;
  provider: "ollama" | "openai" | "anthropic";
  model: string;
};

export type OllamaSetting = BaseSetting & {
  provider: "ollama";
  baseURL: string | null;
};

export type OpenAiSetting = BaseSetting & {
  provider: "openai";
  apiKey: string | null;
};

export type AnthropicSetting = BaseSetting & {
  provider: "anthropic";
  apiKey: string | null;
};

export const openAiModels = [
  "gpt-4o-mini",
  "gpt-3.5-turbo",
  "gpt-4o",
  "gpt-4",
  "gpt-4-turbo",
];
export const ollamaModels = [
  "llama3.1:8b",
  "llama3:8b",
  "llama2",
  "gemma2",
  "phi3",
  "mistral",
  "mixtral",
];

export const anthropicModels = [
  "claude-3-5-sonnet-20240620",
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307",
];
export type AiSetting = OllamaSetting | OpenAiSetting | AnthropicSetting;
