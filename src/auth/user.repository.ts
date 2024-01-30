import { CustomRepository } from 'src/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User | null> {
    const { username, password } = authCredentialsDto;
    const newUser = this.create({ username, password });
    try {
      return await this.save(newUser);
    } catch (err) {
      console.log('err::', err);
      if (err.code === '23505') {
        throw new ConflictException('이미 존재하는 이름입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
