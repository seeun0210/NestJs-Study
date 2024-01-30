import { Module } from '@nestjs/common';
import { ControllerService } from './controller/controller.service';
import { AuthService } from './auth.service';

@Module({
  providers: [ControllerService, AuthService]
})
export class AuthModule {}
