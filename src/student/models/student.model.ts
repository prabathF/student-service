import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
@Directive('@key(fields: "id")')
export class Student {
  @Field((type) => ID)
  id: Number;

  @Field()
  name: String;

  @Field()
  email: String;

  @Field()
  birthDate: Date;

  @Field()
  age: Number;

  @Field((type) => [Post])
  student?: Post;
}
