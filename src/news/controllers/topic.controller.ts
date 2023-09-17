import { Body, Controller, Post } from '@nestjs/common';
import { TopicService } from '../services/topic.service';

@Controller('topic')
export class TopicController {
    constructor(
        private service: TopicService
    ) {}

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }
}
