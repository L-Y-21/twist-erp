import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import type { User } from "./entities/user.entity"
import type { LoginDto } from "./dto/login.dto"
import type { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthService {
  private userRepository: Repository<User>
  private jwtService: JwtService

  constructor(userRepository: Repository<User>, jwtService: JwtService) {
    this.userRepository = userRepository
    this.jwtService = jwtService
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["roles", "company"],
    })

    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Account is inactive")
    }

    const { password: _, ...result } = user
    return result
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)

    const payload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      roles: user.roles?.map((r) => r.name) || [],
      permissions: this.extractPermissions(user.roles),
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" })

    await this.userRepository.update(user.id, {
      refreshToken: await bcrypt.hash(refreshToken, 10),
      lastLogin: new Date(),
    })

    return {
      accessToken,
      refreshToken,
      user,
    }
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    })

    if (existingUser) {
      throw new BadRequestException("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    })

    await this.userRepository.save(user)

    const { password: _, ...result } = user
    return result
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ["roles"],
      })

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException("Invalid refresh token")
      }

      const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken)

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException("Invalid refresh token")
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        companyId: user.companyId,
        roles: user.roles?.map((r) => r.name) || [],
        permissions: this.extractPermissions(user.roles),
      }

      const accessToken = this.jwtService.sign(newPayload)

      return { accessToken }
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token")
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: null })
    return { message: "Logged out successfully" }
  }

  private extractPermissions(roles: any[]): string[] {
    const permissions = new Set<string>()
    roles?.forEach((role) => {
      role.permissions?.forEach((permission: any) => {
        permissions.add(permission.name)
      })
    })
    return Array.from(permissions)
  }
}
