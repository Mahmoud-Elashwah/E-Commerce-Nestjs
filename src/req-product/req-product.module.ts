import { Module } from '@nestjs/common';
import { ReqProductService } from './req-product.service';
import { ReqProductController } from './req-product.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/user.schema';
import { reqProductSchema } from './req-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ReqProduct', schema: reqProductSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ReqProductController],
  providers: [ReqProductService],
})
export class ReqProductModule {}
