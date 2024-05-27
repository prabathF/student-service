import { Field, ObjectType } from '@nestjs/graphql';
import { Student } from './student.model';

@ObjectType()
export class StudentsWithCount {
  @Field()
  totalCount: number;

  @Field(() => [Student])
  students: Student[];
}
