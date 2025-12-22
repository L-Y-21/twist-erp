import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import type { ConfigService } from "@nestjs/config"
import { User } from "../entities/user.entity"
import type { Repository } from "typeorm"
import { getRepository } from "typeorm"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private userRepository: Repository<User>

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") || "twist-erp-secret-key",
    })
    this.userRepository = getRepository(User)
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ["roles", "company"],
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException()
    }

    return {
      id: user.id,
      email: user.email,
      companyId: user.companyId,
      roles: payload.roles,
      permissions: payload.permissions,
    }
  }
}
