declare namespace Global {
  export type Seller = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    cpf: string | null;
    cep: string | null;
    state: string | null;
    city: string | null;
    neighborhood: string | null;
    address: string | null;
    role: "user" | "admin";
    created_at: string;
  };

  export type Product = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    old_price: number | null;
    price: number;
    category: string | null;
    model: string | null;
    color: string | null;
    brand: string | null;
    condition: string | null;
    images: string[];
    cep: string | null;
    state: string | null;
    city: string | null;
    neighborhood: string | null;
    stock: number;
    pix: string | null;
    user_id: string;
    status: "active" | string;
    created_at: string;
    users: Seller;
  };
}
