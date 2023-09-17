import { IsNumber, IsString } from "class-validator";

export class crawlListDto {
    @IsString()
    url: string;

    @IsString()
    card: string;

    @IsString()
    card_link: string;

    @IsString()
    card_title: string;

    @IsString()
    card_img: string;
}