import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { jwtPayload } from './dto/jwt-interface.payload';

Injectable();
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'qwerty',
    });
  }
  async validate(payload: jwtPayload) {
    const user = await this.UserRepository.findOneBy({
      username: payload.username,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
