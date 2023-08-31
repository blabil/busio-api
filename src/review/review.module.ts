import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, JwtStrategy]
})
export class ReviewModule {}
