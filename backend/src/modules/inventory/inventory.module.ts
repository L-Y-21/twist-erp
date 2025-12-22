import { Module } from "@nestjs/common"
import { ItemsModule } from "./items/items.module"
import { CategoriesModule } from "./categories/categories.module"
import { StoresModule } from "./stores/stores.module"
import { StockModule } from "./stock/stock.module"
import { TransactionsModule } from "./transactions/transactions.module"
import { ValuationModule } from "./valuation/valuation.module"

@Module({
  imports: [ItemsModule, CategoriesModule, StoresModule, StockModule, TransactionsModule, ValuationModule],
})
export class InventoryModule {}
