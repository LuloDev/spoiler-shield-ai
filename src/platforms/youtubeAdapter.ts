import { WebPage, type InfoContent } from "./webPage";

export class YouTubeAdapter extends WebPage {
  private started = false;

  constructor() {
    super();
  }

  processInitialData() {
    const observer = new MutationObserver((mutationsList, observer) => {
      const ytBrowse = document.body.querySelector("ytd-browse");
      const ytSearch = document.body.querySelector("ytd-search");
      const container = ytBrowse ?? ytSearch;
      if (!container) {
        return null;
      }
      const contents = container.querySelector("#contents");
      if (!contents) {
        return null;
      }
      observer.disconnect();
      const videoList: HTMLElement[] = Array.from(
        document.querySelectorAll("ytd-rich-item-renderer")
      );
      const videoList2: HTMLElement[] = Array.from(
        document.querySelectorAll("ytd-video-renderer")
      );
      this.subject.notify([...videoList, ...videoList2]);
    });
    observer.observe(document.body, { childList: true, subtree: true });
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
          if (!this.started) {
            const sections = Array.from(
              node.parentElement?.querySelectorAll(
                "ytd-item-section-renderer"
              ) ?? []
            );
            sections.forEach((section) => {
              const contents = section.querySelector("#contents");
              if (contents) {
                this.subscribeNodeChanges(Promise.resolve(contents));
              }
            });

            this.started = true;
          }
          if (node.nodeName === "YTD-ITEM-SECTION-RENDERER") {
            const contents = (node as HTMLElement).querySelector("#contents");
            if (contents) {
              this.subscribeNodeChanges(Promise.resolve(contents));
            }
          }
          if (node.nodeName === "YTD-SHELF-RENDERER") {
            const videos: HTMLElement[] = Array.from(
              (node as HTMLElement).querySelectorAll("ytd-video-renderer")
            );
            videoList.push(...videos);
          }
          if (
            node.nodeName === "YTD-VIDEO-RENDERER" ||
            node.nodeName === "YTD-RICH-ITEM-RENDERER" ||
            node.nodeName === "YTD-COMPACT-VIDEO-RENDERER"
          ) {
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
      observer.observe(contents, config);
      if (this.started) this.subject.notify(this.fetchVideoItems(contents));
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
        return contentSearch.querySelector("#contents");
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

  hiddenLoading(video: HTMLElement) {
    let fontSize = "16px";
    if (video.nodeName === "YTD-COMPACT-VIDEO-RENDERER") {
      fontSize = "14px";
    }
    video
      .querySelector("#dismissible")
      ?.setAttribute("style", "filter: blur(10px)");

    const spoilerContainer = document.createElement("div");
    spoilerContainer.setAttribute("id", "spoiler-container");
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

    const text = document.createElement("p");
    text.style.marginBottom = "10px";
    text.textContent = "Analyzing...";
    text.style.fontSize = fontSize;
    spoilerContainer.appendChild(text);
    video.style.position = "relative";
    video.appendChild(spoilerContainer);
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
    revealButton.textContent = "View Spoiler";
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

  removeLoading(html: HTMLElement): void {
    const spoilerContainer = html.querySelector("#spoiler-container");
    if (spoilerContainer) {
      spoilerContainer.remove();
    }
    this.displayContent(html);
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
