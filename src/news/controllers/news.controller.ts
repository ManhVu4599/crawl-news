import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { NewsService } from '../services/news.service';
import { EventsGateway } from 'src/events/events.gateway';
import { ListNewsDto } from '../dtos/listNews.dto';
import { NewsDto } from '../dtos/news.dto';
import { crawlListDto } from '../dtos/crawlList.dto';
import { crawlDetailDto } from '../dtos/crawlDetail.dto';

@Controller('news')
export class NewsController {
    constructor(private service: NewsService) {}

        @Get()
        listNews(@Query() query: ListNewsDto) {
            return  this.service.listNews(query);
        }

        @Post()
        createNews(@Body() body: NewsDto) {
            return this.service.create(body);
        }

        @Post('crawl')
        async crawl(@Body() data: crawlListDto) {
            return await this.service.crawlList(data);
        }

        @Put('crawl-detail/:id')
        async crawlDetail(@Body() data: crawlDetailDto, @Param('id') id: string) {
            return await this.service.crawlDetail(data, id);
        }
}
