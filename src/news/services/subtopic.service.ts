import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubTopicDocument } from '../schemas/subtopic.shema';
import { SubTopicDto } from '../dtos/subtopic.dto';

@Injectable()
export class SubtopicService {
    constructor(
        @InjectModel('SubTopic') private readonly model: Model<SubTopicDocument>
    ) {}

    create(data: SubTopicDto) {
        const topic = new this.model(data);
        return topic.save();
    }
}
