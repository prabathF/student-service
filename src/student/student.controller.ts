import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { csvFileFilter, csvFileName } from 'src/utils/file.utils';
import { QueueService } from './queue/queue.service';

@Controller('student')
export class StudentController {
  constructor(private queueService: QueueService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/',
        filename: csvFileName,
      }),
      fileFilter: csvFileFilter,
    }),
  )
  uploadMyFiles(@UploadedFile() file: Express.Multer.File) {
    this.queueService.addFileToQueue(`./files/${file.filename}`);
  }
}
