import { WebPage, type InfoContent } from "./webPage";

export class YouTubeAdapter extends WebPage {
  constructor() {
    super();
  }

  processInitialData() {
    const videoList: HTMLElement[] = Array.from(
      document.querySelectorAll("ytd-rich-item-renderer")
    );
    const videoList2: HTMLElement[] = Array.from(
      document.querySelectorAll("ytd-video-renderer")
    );
    this.subject.notify([...videoList, ...videoList2]);
  }

  private waitForBrowse(callback: () => Element | null): Promise<Element> {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutationsList, observer) => {
        const target = callback();
        if (target) {
          observer.disconnect();
          resolve(target);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  private fetchVideoItems(node: Element): Element[] {
    const videosHome = Array.from(
      node.querySelectorAll("ytd-rich-item-renderer") ?? []
    );
    const videosSearch = Array.from(
      node.querySelectorAll("ytd-video-renderer") ?? []
    );
    return [...videosHome, ...videosSearch];
  }

  private mutation(mutationsList: MutationRecord[]) {
    const videoList: HTMLElement[] = [];
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === "YTD-SHELF-RENDERER") {
            const videos: HTMLElement[] = Array.from(
              (node as HTMLElement).querySelectorAll("ytd-video-renderer")
            );
            videoList.push(...videos);
          } else {
            videoList.push(node as HTMLElement);
          }
        });
      }
    }
    if (videoList.length > 0) this.subject.notify(videoList);
  }

  private subscribeNodeChanges(promise: Promise<Element>) {
    promise.then((contents) => {
      const config = { childList: true, subtree: false };
      const observer = new MutationObserver((mutationsList) =>
        this.mutation(mutationsList)
      );
      if (!contents) {
        return;
      }
      this.subject.notify(this.fetchVideoItems(contents));
      observer.observe(contents, config);
    });
  }

  async subscribeChanges() {
    // Home page
    this.subscribeNodeChanges(
      this.waitForBrowse(() => {
        const ytBrowse = document.body.querySelector("ytd-browse");
        if (!ytBrowse) {
          return null;
        }
        return ytBrowse.querySelector("#contents");
      })
    );

    // Search page
    this.subscribeNodeChanges(
      this.waitForBrowse(() => {
        const contentSearch = document.body.querySelector("ytd-search");
        if (!contentSearch) {
          return null;
        }
        const parentContents = contentSearch.querySelector("#contents");
        // TODO SUBSCRIBE TO PARENT CONTENTS TO GET THE VIDEOS SECTIONS
        // ytd-item-section-renderer no directy #contents,
        // second #contents is only first section after load more yt add more sections
        const contents = parentContents?.querySelectorAll("#contents");
        if (contents) {
          for (const content of contents) {
            if (content.querySelector("ytd-video-renderer")) {
              return content;
            }
          }
        }
        return null;
      })
    );

    // video page
    this.subscribeNodeChanges(
      this.waitForBrowse(() => {
        const video = document.body.querySelector("ytd-watch-flexy");
        if (!video) {
          return null;
        }
        const related = video.querySelector("#related");
        if (!related) {
          return null;
        }
        return related.querySelector("#contents");
      })
    );
  }

  hiddenSpoiler(video: HTMLElement, name: string, spoilerProbability: number) {
    // is element ytd-compact-video-renderer
    let fontSize = "16px";
    let buttonFontSize = "14px";
    if (video.nodeName === "YTD-COMPACT-VIDEO-RENDERER") {
      fontSize = "14px";
      buttonFontSize = "12px";
    }
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
    spoilerText.style.fontSize = fontSize;

    const revealButton = document.createElement("button");
    revealButton.textContent = "Revelar Spoiler";
    revealButton.style.padding = "10px 20px";
    revealButton.style.fontSize = buttonFontSize;
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
      .querySelector("#dismissible")
      ?.setAttribute("style", "filter: blur(10px)");
  }

  displayContent(video: HTMLElement) {
    video.querySelector("#dismissible")?.setAttribute("style", "filter: none");
  }

  getInfoItem(element: HTMLElement): InfoContent | null {
    const title = element.querySelector("#video-title")?.textContent;
    if (!title) {
      return null;
    }
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
