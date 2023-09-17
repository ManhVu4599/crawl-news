import { Module } from '@nestjs/common';
import { NewsController } from './controllers/news.controller';
import { NewsService } from './services/news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSchema } from './schemas/news.schema';
import { EventsModule } from 'src/events/events.module';
import { TopicSchema } from './schemas/topic.schema';
import { SubTopicSchema } from './schemas/subtopic.shema';
import { TopicController } from './controllers/topic.controller';
import { SubtopicService } from './services/subtopic.service';
import { TopicService } from './services/topic.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'News', schema: NewsSchema },
      { name: 'Topic', schema: TopicSchema},
      { name: 'SubTopic', schema: SubTopicSchema}
    ]),
    EventsModule
  ],
  exports:[NewsService],
  controllers: [NewsController, TopicController],
  providers: [NewsService, SubtopicService, TopicService]
})
export class NewsModule {}
