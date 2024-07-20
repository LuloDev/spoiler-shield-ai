import type { WebPage } from "../platforms/webPage";
import { YouTubeAdapter } from "../platforms/youtubeAdapter";
import { AiService } from "../services/aiService";

async function main() {
  let platform: WebPage | null = null;
  const { isActive } = await chrome.storage.sync.get(["isActive"]);
  if (!isActive) {
    console.log("Extension is disabled");
    return;
  }
  const ai = new AiService();
  if (document.URL.includes("youtube.com")) {
    platform = new YouTubeAdapter();
  }

  if (platform) {
    platform.subscribeToNewData(async (video) => {
      const content = video.map((item) => platform.getInfoItem(item));
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
          }
        }
      });
    });

    platform.subscribeChanges();
  }
}
main();
