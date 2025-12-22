import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Asset } from "./entities/asset.entity"

@Injectable()
export class AssetsService {
  constructor(private assetRepository: Repository<Asset>) {}

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    })
  }
}
