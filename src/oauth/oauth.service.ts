import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OauthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async googleCallback(theUser: any) {
    const user = await this.userModel.findOne({
      email: theUser.profile.email,
    });
    if (user) {
      const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
      };

      const token = this.jwtService.sign(payload, {
        secret: process.env.JWt_SECRET,
        expiresIn: '1d',
      });

      return {
        status: 'success',
        token,
        data: {
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          age: user.age,
          phoneNumber: user.phoneNumber,
          address: user.address,
        },
      };
    }
    const random = crypto.randomBytes(32).toString('hex');
    const password = await bcrypt.hash(random, 10);

    const newUser = await this.userModel.create({
      name: theUser.profile._json.name,
      email: theUser.profile.email,
      role: 'user',
      avatar: theUser.profile._json.picture,
      password,
    });

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWt_SECRET,
      expiresIn: '1d',
    });

    return {
      status: 'success',
      token,
      data: {
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        age: newUser.age,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
      },
    };
  }
}
