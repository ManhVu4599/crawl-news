import { IsString } from "class-validator";

export class NewsDto {
    @IsString()
    image: string;

    @IsString()
    video: string;

    @IsString()
    link: string;

    @IsString()
    title: string;

    @IsString()
    contnet: string;

    @IsString()
    source: string;

    @IsString()
    listImage: [];

    @IsString()
    time: Date;
}