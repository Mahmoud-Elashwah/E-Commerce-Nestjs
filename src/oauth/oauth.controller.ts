import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OauthService } from './oauth.service';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google')) //AuthGuard form passport
  googleLogin() {
    return 'all good';
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google')) //AuthGuard form passport
  googleCallback(@Req() req: any) {
    return this.oauthService.googleCallback(req.user);
  }
}
