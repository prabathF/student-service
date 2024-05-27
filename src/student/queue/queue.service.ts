import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { FILE_PROCESSOR_QUEUE } from '../../constants/constant';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(FILE_PROCESSOR_QUEUE) private readonly transcodeQueue: Queue,
  ) {}

  async addFileToQueue(fileName: string) {
    await this.transcodeQueue.add(
      {
        fileName: fileName,
      },
      {
        removeOnComplete: true,
      },
    );
  }
}
