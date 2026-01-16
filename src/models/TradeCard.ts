import type { Card } from "./Card";

export interface TradeCard {
  id: string,
  cardId: string,
  tradeId: string,
  type: 'OFFERING' | 'RECEIVING',
  card: Card
}
