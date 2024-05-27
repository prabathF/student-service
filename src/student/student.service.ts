import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { StudentUpdateArgs } from './dto/student-update.args';
import { GraphQLError } from 'graphql';
import { StudentArgs } from './dto/student.args';
import { StudentsWithCount } from './models/studentsWithCount.model';
import { getAge } from '../utils/age.utils';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private userRepository: Repository<Student>,
  ) {}

  async create(student: Student): Promise<Student> {
    return this.userRepository.save(student);
  }

  async students(studentArgs: StudentArgs): Promise<StudentsWithCount> {
    const [result, total] = await this.userRepository.findAndCount({
      take: studentArgs.take,
      skip: studentArgs.skip,
      order: {
        id: 'ASC',
      },
    });
    return {
      students: result,
      totalCount: total,
    };
  }

  async findById(id: number): Promise<Student> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async delete(id: number): Promise<Student> {
    const findData = await this.findById(id);
    if (!findData) {
      throw new GraphQLError('Studnet not found');
    }
    await this.userRepository.delete(id);
    return findData;
  }

  async update(studentUpdateArgs: StudentUpdateArgs): Promise<Student> {
    const findData = await this.findById(studentUpdateArgs.id);
    if (!findData) {
      throw new GraphQLError('Studnet not found');
    }
    const updatedRecord = await this.userRepository.save({
      id: findData.id,
      age: getAge(studentUpdateArgs.birthDate),
      birthDate: studentUpdateArgs.birthDate,
      email: studentUpdateArgs.email,
      name: studentUpdateArgs.name,
    });
    return updatedRecord;
  }
}
