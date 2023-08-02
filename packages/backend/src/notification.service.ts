import { Injectable } from '@nestjs/common';
import { Observable, filter, fromEvent, iif, of } from 'rxjs';
import { EventEmitter } from 'events';

@Injectable()
export class NotificationService {
  private readonly emitter: EventEmitter;

  constructor() {
    // Inject some Service here and everything about SSE will stop to work.
    this.emitter = new EventEmitter();
  }

  subscribe(req: Request): Observable<MessageEvent> {
    return fromEvent(this.emitter, 'notifier').pipe(
      filter((messageEvent: MessageEvent) => {
        const subscriberId =
          req.headers?.['authorization'].split(' ')[1] ?? null;
        const data = messageEvent.data;
        const targetUserId = messageEvent.data.userId;

        return data && targetUserId == subscriberId;
      }),
    );
  }

  async emit(data) {
    console.log('data', data);

    this.emitter.emit('notifier', { data });
  }
}
