import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeMethodController } from './semethod.controller';
import { SeMethodService } from './semethod.service';
import { SeMethod, SeMethodSchema } from './semethod.schema';

/**
 * SeMethodModule encapsulates the functionality related to SE methods.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: SeMethod.name, schema: SeMethodSchema }]),
  ],
  controllers: [SeMethodController],
  providers: [SeMethodService],
  exports: [SeMethodService],
})
export class SeMethodModule {}
