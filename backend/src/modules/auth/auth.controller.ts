import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import type { LoginDto } from "./dto/login.dto"
import type { RegisterDto } from "./dto/register.dto"
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard"
import { CurrentUser } from "../../common/decorators/current-user.decorator"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "User login" })
  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post("register")
  @ApiOperation({ summary: "User registration" })
  async register(registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  async logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}
