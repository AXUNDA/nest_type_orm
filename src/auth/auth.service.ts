import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentials } from './dto/auth-credentials.dto';
// import { ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    private jwtSevice: JwtService,
  ) {}

  async signup(dto: AuthCredentials) {
    const { username, password } = dto;
    try {
      const salt = await bcrypt.genSaltSync(10);

      const hash = await bcrypt.hashSync(password, salt);

      const newUser = await this.UserRepository.save({
        username,
        password: hash,
      });
      return newUser;
    } catch (error) {
      if (error.code == '23505')
        throw new ConflictException(
          `user with username ${username} already exists`,
        );
    }
  }
  async signIn(dto: AuthCredentials) {
    const user = await this.UserRepository.findOneBy({
      username: dto.username,
    });
    if (!user && (await bcrypt.compareSync(dto.password, user.password)))
      throw new ForbiddenException('invalid credentials');

    const accessToken = await this.jwtSevice.sign({ username: dto.username });
    return { accessToken };
  }
}
