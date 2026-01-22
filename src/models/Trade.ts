import type { TradeCard } from "./TradeCard";
import type { User } from "./User";

export interface Trade {
  id?: string,
  userId: string,
  createdAt: string,
  user: User
  tradeCards: TradeCard[]
  more?: boolean
}
