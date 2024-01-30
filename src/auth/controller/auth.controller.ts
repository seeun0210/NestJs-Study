import { Body, Controller, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthCredentialsDto } from '../dto/auth-credential.dto';
import { Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthCredentialsDto> {
    const result = await this.authService.signUp(authCredentialsDto);
    console.log(result);
    return result;
  }
}
