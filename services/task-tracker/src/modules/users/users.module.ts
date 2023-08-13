import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MikroOrmModule } from '@prizma/nestjs';
import { User } from '../../entities';
import { UsersController } from './users.controller';
import { UsersConsumer } from './users.consumer';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UsersService, UsersConsumer],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
