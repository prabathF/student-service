import {
  Resolver,
  Query,
  ResolveReference,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { Student } from './models/student.model';
import { StudentService } from './student.service';
import { StudentArgs } from './dto/student.args';
import { StudentUpdateArgs } from './dto/student-update.args';
import { StudentsWithCount } from './models/studentsWithCount.model';

@Resolver((of) => Student)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Query((returns) => StudentsWithCount)
  students(
    @Args('studentArgs') studentArgs: StudentArgs,
  ): Promise<StudentsWithCount> {
    return this.studentService.students(studentArgs);
  }

  @Query((returns) => [Student])
  student(@Args('id') id: number): Promise<Student> {
    return this.studentService.findById(id);
  }

  @Mutation((returns) => Student)
  updateStudent(
    @Args('studentUpdateArgs') studentUpdateArgs: StudentUpdateArgs,
  ): Promise<Student> {
    return this.studentService.update(studentUpdateArgs);
  }

  @Mutation((returns) => Student)
  deleteStudent(@Args('id') id: number): Promise<Student> {
    return this.studentService.delete(id);
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: number;
  }): Promise<Student> {
    return this.studentService.findById(reference.id);
  }
}
