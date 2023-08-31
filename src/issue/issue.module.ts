import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [IssueController],
  providers: [IssueService, JwtStrategy]
})
export class IssueModule {}
