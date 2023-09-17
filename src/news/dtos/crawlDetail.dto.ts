import { IsNumber, IsString } from "class-validator";

export class crawlDetailDto {
    @IsString()
    card: string;

    @IsString()
    card_content: string;

    @IsString()
    card_topic: string;

    @IsString()
    card_topic_title: string;

    @IsString()
    card_img: string;

    @IsString()
    card_time: string;
}