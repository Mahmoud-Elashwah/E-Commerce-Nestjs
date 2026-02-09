import { Body, Controller, Param, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  signInDto,
  SignUpDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signUpDto: SignUpDto,
  ) {
    return this.authService.signUp(signUpDto);
  }
  @Post('/log-in')
  logIn(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signInDto: signInDto,
  ) {
    return this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);

    return {
      message: 'If the email exists, a reset link has been sent',
    };
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(token, dto.newPassword);

    return { message: 'Password reset successfully' };
  }
}
