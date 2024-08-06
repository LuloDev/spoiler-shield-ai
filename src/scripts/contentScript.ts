import type { WebPage } from "../platforms/webPage";
import { YouTubeAdapter } from "../platforms/youtubeAdapter";
import { AiService } from "../services/aiService";

async function main() {
  let platform: WebPage | null = null;
  const { isActive } = await chrome.storage.sync.get(["isActive"]);
  if (!isActive) {
    return;
  }
  const ai = new AiService();
  if (document.URL.includes("youtube.com")) {
    platform = new YouTubeAdapter();
  }

  if (platform) {
    platform.processInitialData();
    platform.subscribeToNewData(async (videos) => {
      videos.forEach((item) => platform.hiddenLoading(item));
      const content = videos
        .map((item) => platform.getInfoItem(item))
        .filter((item) => item !== null);

      const result = await ai.isSpoiler(content);
      videos.forEach((item) => platform.removeLoading(item));

      result.data.forEach(async (item) => {
        const { settings } = await chrome.storage.sync.get(["settings"]);
        const umbral = settings.umbral ?? 0.5;
        if (item.probability > umbral) {
          const video = content.find((video) => video.id === item.id);
          if (video) {
            platform.hiddenSpoiler(
              video.html,
              item.name ?? "Spoiler",
              item.probability
            );
            video.probability = item.probability;
          }
        }
      });
    });

    platform.subscribeChanges();
  }
}
main();
