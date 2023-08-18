import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { prizmaStreamingContext } from '@nestjs-plugins/nestjs-prizma-streaming-transport';
import { BaseEvent } from '@app/event-schema-registry/types/base-event.type';
import { UsersService } from './users.service';
import { UsersConsumer } from './users.consumer';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
    @Inject(UsersConsumer)
    private readonly userConsumer: UsersConsumer,
  ) {}

  @EventPattern('user')
  async listenUserEvents(
    @Payload() data: BaseEvent<any, any>,
    @Ctx() ctx: prizmaStreamingContext,
  ) {
    await this.userConsumer.handleEvent(data);
    ctx.message.ack();
  }

  @EventPattern('user-stream')
  async listerUserCUDEvents(
    @Payload() data: BaseEvent<any, any>,
    @Ctx() ctx: prizmaStreamingContext,
  ): Promise<void> {
    await this.userConsumer.handleEvent(data);
    ctx.message.ack();
  }
}
