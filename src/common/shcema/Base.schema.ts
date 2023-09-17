import { Prop } from "@nestjs/mongoose";

export abstract class BaseSchema {
    @Prop()
    id: number;
  
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
  
    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
  }