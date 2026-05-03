import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { AuthGuard } from '@nestjs/passport';

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
