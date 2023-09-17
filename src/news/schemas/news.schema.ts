import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseSchema } from 'src/common/shcema/Base.schema';
import { Topic } from './topic.schema';
import { SubTopic } from './subtopic.shema';

export type NewsDocument = News & Document;

@Schema()
export class News extends BaseSchema {
    @Prop({ default: null })
    image: string;

    @Prop({ default: null })
    video: string;

    @Prop({ default: null })
    link: string;

    @Prop({ default: null })
    title: string

    @Prop({ default: null })
    content: string

    @Prop()
    source: string;

    @Prop({ default: null })
    listImage: [];

    @Prop({ type: Date, default: Date.now, index: true })
    time: Date;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'topic_id' }] })
    topic_id: Topic;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subTopic_id' }] })
    subTopic_id: SubTopic;
}

export const NewsSchema = SchemaFactory.createForClass(News);