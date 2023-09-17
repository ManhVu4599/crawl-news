import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/shcema/Base.schema';

export type TopicDocument = Topic & Document;

@Schema()
export class Topic extends BaseSchema {
    @Prop({ default: null, index: true })
    name: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);