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
    platform.subscribeToNewData(async (videos) => {
      console.log("videos", videos);
      const content = videos
        .map((item) => platform.getInfoItem(item))
        .filter((item) => item !== null);

      const result = await ai.isSpoiler(content);
      result.data.forEach((item) => {
        if (item.probability > 0.5) {
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
      console.log("result", content);
    });

    platform.subscribeChanges();
  }
}
main();
