import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { BullModule } from '@nestjs/bull';
import { FILE_PROCESSOR_QUEUE } from 'src/constants/constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentFileConsumer } from './consumers/student.consumer';
import { StudentResolver } from './student.resolver';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { StudentGateway } from './student.gateway';
import { QueueService } from './queue/queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: FILE_PROCESSOR_QUEUE,
    }),
    TypeOrmModule.forFeature([Student]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      plugins: [ApolloServerPluginInlineTrace()],
    }),
  ],
  controllers: [StudentController],
  providers: [
    QueueService,
    StudentService,
    StudentFileConsumer,
    StudentResolver,
    StudentGateway,
    QueueService,
  ],
})
export class StudentModule {}
