import { Injectable } from '@nestjs/common';
import { TopicDocument } from '../schemas/topic.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopicDto } from '../dtos/topic.dto';

@Injectable()
export class TopicService {
    constructor(
        @InjectModel('Topic') private readonly model: Model<TopicDocument>
    ) {}

    create(data: TopicDto) {
        const topic = new this.model(data);
        return topic.save();
    }
}
