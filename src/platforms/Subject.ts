export type Observer = (video: HTMLElement[]) => void;

export class Subject {
  private observers: Observer[] = [];

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(video: HTMLElement[]) {
    this.observers.forEach((observer) => observer(video));
  }
}
