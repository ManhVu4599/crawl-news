import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from './news/news.module';
import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';
import { TopicService } from './news/services/topic.service';
import { SubtopicService } from './news/services/subtopic.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
        
      useFactory: async (cfg: ConfigService) => {
        console.log('url:', cfg.get('MONGODB_URL'),)
        return {
          uri: cfg.get('MONGODB_URL'),
          dbName: 'crawl'
        }
      },
      inject: [ConfigService],
    }),
    NewsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule { }
