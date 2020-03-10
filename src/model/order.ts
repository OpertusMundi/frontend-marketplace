export interface OrderItem {
  id: string;
  index: number;
  price: number;
}

export interface Order {
  id: string | null;
  items: OrderItem[];
}
