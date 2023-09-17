import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/shcema/Base.schema';

export type SubTopicDocument = SubTopic & Document;

@Schema()
export class SubTopic extends BaseSchema {
    @Prop({ default: null, index: true })
    name: string;

    @Prop({ default: null })
    topic_id: string;
}

export const SubTopicSchema = SchemaFactory.createForClass(SubTopic);