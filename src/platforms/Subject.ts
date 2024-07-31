export type Observer = (video: Element[]) => void;

export class Subject {
  private observers: Observer[] = [];
  private buffer: Element[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly BUFFER_SIZE = 12;
  private readonly TIMEOUT = 1000; // 1 segundo

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  private flushBuffer() {
    if (this.buffer.length > 0) {
      const itemsToNotify = [...this.buffer];
      this.buffer = [];
      this.notifyObservers(itemsToNotify);
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  }

  private notifyObservers(video: Element[]) {
    this.observers.forEach((observer) => observer(video));
  }

  notify(video: Element[]) {
    this.buffer.push(...video);
    if (this.buffer.length >= this.BUFFER_SIZE) {
      this.flushBuffer();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flushBuffer(), this.TIMEOUT);
    }
  }
}
