import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Student } from './student.model';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Post {
  @Field((type) => ID)
  @Directive('@external')
  id: number;

  @Field((type) => [Student])
  students?: Student[];
}
