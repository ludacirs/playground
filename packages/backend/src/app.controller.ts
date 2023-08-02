import { Body, Controller, Get, Post, Req, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, interval, map } from 'rxjs';
import { NotificationService } from './notification.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('sse')
  sse(@Req() req: Request): Observable<MessageEvent> {
    return this.notificationService.subscribe(req);
  }

  @Post()
  notify(@Body() body: BodyInit): void {
    this.notificationService.emit(body);
    return;
  }
}
