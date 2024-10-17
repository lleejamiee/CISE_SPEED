import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type SeMethodDocument = HydratedDocument<SeMethod>;

/**
 * Embedded Claim within SeMethod
 */
export class Claim {
  @Prop({ required: true })
  name: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);

/**
 * Mongoose schema for the SeMethod entry
 */
@Schema()
export class SeMethod {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.Array, default: []})
  claims: Claim[];
}

export const SeMethodSchema = SchemaFactory.createForClass(SeMethod);
