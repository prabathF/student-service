import { Process, Processor } from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Job } from 'bull';
import csv = require('csv-parser');
import { createReadStream } from 'fs';
import { FILE_PROCESSOR_QUEUE } from 'src/constants/constant';
import { Student } from 'src/student/entities/student.entity';
import { StudentService } from 'src/student/student.service';
import { getAge } from 'src/utils/age.utils';
import { StudentGateway } from '../student.gateway';

@Processor(FILE_PROCESSOR_QUEUE)
export class StudentFileConsumer {
  private readonly logger = new Logger(StudentFileConsumer.name);

  constructor(
    private studentService: StudentService,
    private studentGateway: StudentGateway,
  ) {}

  @Process()
  async transcode(job: Job) {
    this.logger.log(`Student processor job started: ${job.data}`);
    try {
      await this.readFileAndProcessData(job);
      this.studentGateway.emitNotification(
        `Student processor job completed: ${job.id}`,
      );
      this.logger.log(`Student processor job completed: ${job.id}`);
    } catch (error) {
      this.logger.error(
        `Student processor job failed: ${job.id} error ${error}`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  readFileAndProcessData(job: Job): Promise<void> {
    return new Promise((resolve, reject) => {
      const results: Student[] = [];
      createReadStream(job.data.fileName)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          for (const student of results) {
            const createdStudent = await this.studentService.create({
              ...student,
              age: getAge(student.birthDate),
            });
            this.logger.log(
              `Student processor created job : ${job.id} student: ${createdStudent.id}`,
            );
          }
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
