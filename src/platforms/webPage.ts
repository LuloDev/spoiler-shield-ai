import { Subject, type Observer } from "./Subject";

export abstract class WebPage {
  protected subject: Subject;

  constructor() {
    this.subject = new Subject();
  }

  abstract hiddenSpoiler(
    html: HTMLElement,
    name: string | undefined | null,
    spoilerProbability: number
  ): void;
  abstract getInfoItem(element: Element): InfoContent | null;
  abstract subscribeChanges(): void;
  subscribeToNewData(observer: Observer) {
    this.subject.subscribe(observer);
  }

  unsubscribeFromNewDAta(observer: Observer) {
    this.subject.unsubscribe(observer);
  }
}

export type InfoContent = {
  id: string;
  title: string;
  author?: string | null;
  description?: string | null;
  html: HTMLElement;
  probability?: number | null;
};
