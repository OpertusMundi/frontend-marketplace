export interface OrderItem {
    amount: number;
    assetId: string;
    position: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
}