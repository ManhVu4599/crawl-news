import { IsNumber, IsString } from "class-validator";

export class ListNewsDto {
    @IsNumber()
    limit: number;

    @IsNumber()
    page: number;

    @IsNumber()
    topic_id: number;

    @IsNumber()
    subtopic_id: number;
}