import type { WebPage } from "../platforms/webPage";
import { YouTubeAdapter } from "../platforms/youtubeAdapter";
import { AiService } from "../services/aiService";

let platform: WebPage | null = null;
const ai = new AiService();
if (document.URL.includes("youtube.com")) {
  platform = new YouTubeAdapter();
}

if (platform) {
  platform.subscribeToNewData(async (video) => {
    const content = video.map((item) => platform.getInfoItem(item));
    platform.hiddenSpoiler(content[0].html, "Cargando...", 0.8);
    const result = await ai.isSpoiler(content);
    result.data.forEach((item, index) => {
      if (item.probability > 0.5) {
        const video = content.find((video) => video.id === item.id);
        if (video) {
          platform.hiddenSpoiler(video.html, item.name, item.probability);
        }
      }
    });
  });

  platform.subscribeChanges();
}
