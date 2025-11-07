declare interface IOrder {
  id: number;
  user_id: number;
  order_number: string;
  status: "pending" | "completed";
  created_at: Date;
  updated_at: Date;
}
