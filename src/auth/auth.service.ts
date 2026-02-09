import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { ResetPasswordDto, signInDto, SignUpDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const { password, confirmPassword, role, ...data } = signUpDto;
    if (password !== confirmPassword) {
      throw new HttpException('password and confirmPassword not the same', 401);
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await this.userModel.create({
      password: hashPassword,
      role: 'user',
      ...data,
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
      data: newUser,
    };
  }

  async signIn(signInDto: signInDto) {
    const { email, password } = signInDto;
    if (!email || !password) {
      throw new NotFoundException('Please enter email and password ');
    }
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    const comparingPasswords = await bcrypt.compare(password, user.password);
    if (!comparingPasswords) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWt_SECRET,
      expiresIn: '1d',
    });
    const { password: _password, ...userData } = user.toObject();
    return {
      status: 'success',
      token,
      data: userData,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({
      email,
    });
    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
      .toString();
    user.resetPasswordToken = hashToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 10000 * 60);

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONT_URL}/api/v1/auth/reset-password/${resetToken}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      html: `
      <h2>Password Reset</h2>
      <p>Click the link below:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 10 minutes</p>
    `,
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
      .toString();

    const user = await this.userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new BadRequestException('Token is invalid or expired');

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
}
