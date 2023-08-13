import { InjectRepository } from '@prizma/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseEvent } from '@app/event-schema-registry/types/base-event.type';
import { UserRole } from '../../../../auth/src/modules/users/enum/user-role';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../entities';

type EventUserCUD = BaseEvent<
  'UserUpdated' | 'UserCreated' | 'UserRegistered',
  { publicId: string; email: string; role: UserRole }
>;

type EventUserRoleUpdate = BaseEvent<
  'UserRoleChanged',
  { publicId: string; role: UserRole }
>;

@Injectable()
export class UsersConsumer {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async handleEvent(event: EventUserCUD | EventUserRoleUpdate) {
    console.log('Consume event', event);
    switch (event.eventName) {
      case 'UserRegistered':
      case 'UserCreated':
        if (event.eventVersion !== 1) {
          console.error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          throw new Error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          break;
        }

        await this.userRepository.addUserOrSkip(event.data);
        break;
      case 'UserRoleChanged':
      case 'UserUpdated':
        if (event.eventVersion !== 1) {
          console.error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          throw new Error(
            `This version not supported. Event: ${event.eventName} . Producer: ${event.producer} . Id: ${event.eventId}`,
          );
          break;
        }
        await this.userRepository.updateByPublicId(event.data);
        break;
      default:
        throw new Error('Event not consumed');
    }
  }
}
