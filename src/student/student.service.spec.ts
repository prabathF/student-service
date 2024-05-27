import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { StudentUpdateArgs } from './dto/student-update.args';
import { GraphQLError } from 'graphql';

describe('StudentService', () => {
  let service: StudentService;
  let userRepository: Repository<Student>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    userRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const student = new Student();
      student.id = 1000;
      student.age = 18;
      student.birthDate = new Date();
      student.name = 'Mock Test Data';
      jest.spyOn(userRepository, 'save').mockResolvedValue(student);

      const result = await service.create(student);

      expect(result).toBe(student);
      expect(userRepository.save).toHaveBeenCalledWith(student);
    });
  });

  describe('students', () => {
    it('should return students with count', async () => {
      const studentArgs = { take: 1, skip: 0 };
      const student = new Student();
      student.id = 1000;
      student.age = 18;
      student.birthDate = new Date();
      student.name = 'Mock Test Data';
      const studentsWithCount: [Student[], number] = [[student], 1];
      jest
        .spyOn(userRepository, 'findAndCount')
        .mockResolvedValue(studentsWithCount);

      const result = await service.students(studentArgs);

      expect(result.totalCount).toEqual(1);
      const studentRepositoryArgs = {
        order: {
          id: 'ASC',
        },
        skip: 0,
        take: 1,
      };

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        studentRepositoryArgs,
      );
    });
  });

  describe('delete', () => {
    it('should delete a student', async () => {
      const mockStudent = new Student();
      mockStudent.id = 1;
      jest.spyOn(service, 'findById').mockResolvedValue(mockStudent);
      jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

      const result = await service.delete(1);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(mockStudent);
    });

    it('should throw GraphQLError if student is not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      await expect(service.delete(1)).rejects.toThrowError(GraphQLError);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const studentUpdateArgs: StudentUpdateArgs = {
        id: 1,
        birthDate: new Date(),
        email: 'test@example.com',
        name: 'Updated Name',
      };
      const mockStudent = new Student();
      mockStudent.id = 1;
      jest.spyOn(service, 'findById').mockResolvedValue(mockStudent);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockStudent);

      const result = await service.update(studentUpdateArgs);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(userRepository.save).toHaveBeenCalledWith({
        id: 1,
        age: expect.any(Number),
        birthDate: studentUpdateArgs.birthDate,
        email: studentUpdateArgs.email,
        name: studentUpdateArgs.name,
      });
      expect(result).toBe(mockStudent);
    });

    it('should throw GraphQLError if student is not found', async () => {
      const studentUpdateArgs: StudentUpdateArgs = {
        id: 1,
        birthDate: new Date(),
        email: 'test@example.com',
        name: 'Updated Name',
      };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      await expect(service.update(studentUpdateArgs)).rejects.toThrowError(
        GraphQLError,
      );
    });
  });
});
