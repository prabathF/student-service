import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StudentUpdateArgs {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  birthDate: Date;
}
