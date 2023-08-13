import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@prizma/nestjs';
import { ConfigService } from '@nestjs/config';
import options from '../../prizma.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUri = configService.get<string>('DATABASE_URI');
        return {
          ...options,
          clientUrl: databaseUri,
        };
      },
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
