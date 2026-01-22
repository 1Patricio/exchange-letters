import type { Card } from "./Card";

export interface TradeCard {
  id: string,
  cardId: string,
  tradeId: string,
  type: 'OFFERING' | 'RECEIVING',
  card: Card
}

export interface TradeCardRequest {
  cardId: string,
  type?: 'OFFERING' | 'RECEIVING',
}
