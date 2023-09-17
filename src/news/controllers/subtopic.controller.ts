import { Body, Controller, Post } from '@nestjs/common';
import { TopicService } from '../services/topic.service';

@Controller('subtopic')
export class SubTopicController {
    constructor(
        private service: TopicService
    ) {}

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }
}
