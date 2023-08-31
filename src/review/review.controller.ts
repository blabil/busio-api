import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { reviewDto } from './dto/review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  registerReview(@Body() dto: reviewDto, @Req() req: Request)
  {
    return this.reviewService.registerReview(dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bus/:id')
  getBusReviews(@Param() params: {id: string})
  {
    return this.reviewService.getBusReviews(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  getUserReviews(@Param() params: {id: string})
  {
    return this.reviewService.getUserReviews(params.id);
  }
}
