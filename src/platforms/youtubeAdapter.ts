import { WebPage, type InfoContent } from "./webPage";

export class YouTubeAdapter extends WebPage {
  constructor() {
    super();
  }

  subscribeChanges() {
    const targetNode = document.querySelector("#contents")!;
    const config = { childList: true, subtree: false };
    const observer = new MutationObserver((mutationsList) => {
      const videoList: HTMLElement[] = [];
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            const videos = Array.from(
              (node as HTMLElement).querySelectorAll(
                "ytd-rich-item-renderer"
              ) ?? []
            );
            if (videos.length > 0) {
              videoList.push(...(videos as HTMLElement[]));
            }
          });
        }
      }
      this.subject.notify(videoList);
    });
    observer.observe(targetNode, config);
  }

  hiddenSpoiler(video: HTMLElement) {
    video.style.filter = "blur(10px)";
  }

  displayContent(video: HTMLElement) {
    video.style.filter = "none";
  }

  getInfoItem(element: HTMLElement): InfoContent {
    const title = element.querySelector("#video-title")?.textContent!;
    const author = element
      .querySelector("#text.complex-string.ytd-channel-name")
      ?.querySelector("a")?.textContent;
    const id = element
      .querySelector(
        "a#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail"
      )
      ?.getAttribute("href")!;

    return { title, author, id, html: element };
  }
}
