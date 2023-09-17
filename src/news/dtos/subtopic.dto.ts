import { IsString } from "class-validator";

export class SubTopicDto {
    @IsString()
    name: string;

    @IsString()
    topic_id: string;
}