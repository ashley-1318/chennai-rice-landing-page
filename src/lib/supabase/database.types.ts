export type BusinessTypeEnum = "retailer" | "wholesaler" | "distributor";
export type OrderStatusEnum = "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatusEnum = "paid" | "unpaid" | "partial";
export type InvoiceStatusEnum = "paid" | "unpaid" | "overdue" | "partial";

export interface Database {
  public: {
    Tables: {
      business_type_terms: {
        Row: {
          type: BusinessTypeEnum;
          label: string;
          tagline: string;
          discount_percent: number;
          discount_label: string;
          quantity_label: string;
          payment_terms: string;
          minimum_order_kg: number;
          available_pack_sizes: number[];
        };
        Insert: Partial<Database["public"]["Tables"]["business_type_terms"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["business_type_terms"]["Row"]>;
        Relationships: [];
      };
      businesses: {
        Row: {
          id: string;
          registered_business_name: string;
          business_type: BusinessTypeEnum;
          gstin: string;
          tin: string;
          shop_name: string;
          number_of_outlets: number;
          representative_contact: string;
          mobile: string;
          email: string;
          delivery_pincode: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["businesses"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Row"]>;
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          business_id: string;
          label: string;
          contact_person: string;
          mobile: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          district: string;
          state: string;
          pincode: string;
          landmark: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["addresses"]["Row"]> & {
          business_id: string;
          contact_person: string;
          mobile: string;
          address_line1: string;
          city: string;
          district: string;
          state: string;
          pincode: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          variety: string;
          description: string;
          origin: string;
          tag: string;
          image_path: string;
          base_price_per_kg: number;
          stock_kg: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          business_id: string;
          order_number: string;
          status: OrderStatusEnum;
          payment_status: PaymentStatusEnum;
          total_weight_kg: number;
          subtotal: number;
          discount: number;
          gst: number;
          freight: number;
          total: number;
          shipping_address_id: string | null;
          billing_address_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & { business_id: string; order_number: string };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          pack_size: number;
          quantity: number;
          unit_price: number;
          total: number;
        };
        Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]> & {
          order_id: string;
          product_id: string;
          product_name: string;
          pack_size: number;
          quantity: number;
          unit_price: number;
          total: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
        Relationships: [];
      };
      order_timeline_steps: {
        Row: {
          id: string;
          order_id: string;
          step_order: number;
          label: string;
          completed: boolean;
          happened_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["order_timeline_steps"]["Row"]> & {
          order_id: string;
          step_order: number;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_timeline_steps"]["Row"]>;
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          business_id: string;
          order_id: string;
          invoice_number: string;
          issue_date: string;
          due_date: string;
          amount: number;
          paid: number;
          balance: number;
          status: InvoiceStatusEnum;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["invoices"]["Row"]> & {
          business_id: string;
          order_id: string;
          invoice_number: string;
          due_date: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Row"]>;
        Relationships: [];
      };
      credit_accounts: {
        Row: {
          business_id: string;
          credit_limit: number;
          outstanding: number;
        };
        Insert: Partial<Database["public"]["Tables"]["credit_accounts"]["Row"]> & { business_id: string };
        Update: Partial<Database["public"]["Tables"]["credit_accounts"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
