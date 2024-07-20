import { WebPage, type InfoContent } from "./webPage";

export class YouTubeAdapter extends WebPage {
  constructor() {
    super();
  }

  processInitialData() {
    const videoList: HTMLElement[] = Array.from(
      document.querySelectorAll("ytd-rich-item-renderer")
    );
    this.subject.notify(videoList);
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
    this.processInitialData();
  }

  hiddenSpoiler(video: HTMLElement, name: string, spoilerProbability: number) {
    const spoilerContainer = document.createElement("div");
    spoilerContainer.style.position = "absolute";
    spoilerContainer.style.top = "0";
    spoilerContainer.style.left = "0";
    spoilerContainer.style.width = "100%";
    spoilerContainer.style.height = "100%";
    spoilerContainer.style.color = "white";
    spoilerContainer.style.display = "flex";
    spoilerContainer.style.flexDirection = "column";
    spoilerContainer.style.justifyContent = "center";
    spoilerContainer.style.alignItems = "center";
    spoilerContainer.style.zIndex = "10";

    const spoilerText = document.createElement("p");
    spoilerText.textContent = `${name}: Probability ${
      spoilerProbability * 100
    }%`;
    spoilerText.style.marginBottom = "10px";
    spoilerText.style.fontSize = "24px";

    const revealButton = document.createElement("button");
    revealButton.textContent = "Revelar Spoiler";
    revealButton.style.padding = "10px 20px";
    revealButton.style.fontSize = "16px";
    revealButton.style.cursor = "pointer";

    // Agregar el evento al botón para revelar el spoiler
    revealButton.addEventListener("click", () => {
      this.displayContent(video);
      spoilerContainer.remove();
    });

    spoilerContainer.appendChild(spoilerText);
    spoilerContainer.appendChild(revealButton);

    video.style.position = "relative";
    video.appendChild(spoilerContainer);
    video
      .querySelector("#content")
      ?.setAttribute("style", "filter: blur(10px)");
  }

  displayContent(video: HTMLElement) {
    video.querySelector("#content")?.setAttribute("style", "filter: none");
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
