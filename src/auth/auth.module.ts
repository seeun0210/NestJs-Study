import { Module } from '@nestjs/common';
import { ControllerService } from './controller/controller.service';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  providers: [ControllerService, AuthService],
})
export class AuthModule {}
