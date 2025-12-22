import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Payment } from "./entities/payment.entity"

@Injectable()
export class PaymentsService {
  constructor(private paymentRepository: Repository<Payment>) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ["customer", "invoice"],
      order: { paymentDate: "DESC" },
    })
  }
}
