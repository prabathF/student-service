import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StudentArgs {
  @Field()
  take: number;

  @Field()
  skip: number;
}
