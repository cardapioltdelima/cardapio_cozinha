
export enum OrderStatus {
  Approved = 'A Fazer',
  InProgress = 'Em Preparo',
  Ready = 'Pronto',
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
  data_agendamento?: string;
  turno?: TurnosEntrega;
  horario_agendamento?: string;
}

// Tipos para integração com Supabase
export type TurnosEntrega = 'manha' | 'tarde' | 'noite';

export interface SupabaseOrder {
  id: number;
  customer_name: string;
  customer_whatsapp: string;
  delivery_address: string;
  payment_method: string;
  status: string;
  subtotal: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  data_agendamento?: string;
  turno?: TurnosEntrega;
  horario_agendamento?: string;
}

export interface SupabaseOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface SupabaseProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
  size?: string;
  unit?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}
