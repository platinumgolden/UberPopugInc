import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import options from '../../mikro-orm.config';

@Module({
  imports: [
    OrmModule.forRootAsync({
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
  exports: [OrmModule],
})
export class OrmModule {}
