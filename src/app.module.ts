import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student/entities/student.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRE_HOST'),
        port: configService.get('POSTGRE_PORT'),
        username: configService.get('POSTGRE_USER'),
        password: configService.get('POSTGRE_PASSWORD'),
        database: configService.get('POSTGRE_DATABASE'),
        entities: [Student],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    StudentModule,
  ],
})
export class AppModule {}
