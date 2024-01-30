import { Body, Controller, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthCredentialsDto } from '../dto/auth-credential.dto';
import { Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../get-user.decorator';
import { User } from '../user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthCredentialsDto> {
    const result = await this.authService.signUp(authCredentialsDto);
    console.log('controller_result::', result);
    return authCredentialsDto;
  }
  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const result = await this.authService.signIn(authCredentialsDto);
    console.log('controller_signin', result);
    return result;
  }
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('user', user);
  }
}
