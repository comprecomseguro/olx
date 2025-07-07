import type { Metadata } from "next";
import { supabase } from "@/supabase";

interface ProductLayoutProps {
  children: React.ReactNode;
}

// Generate dynamic metadata for product pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ teste: string }>;
}): Promise<Metadata> {
  try {
    const { teste } = await params;
    const { data: product, error } = await supabase
      .from("products")
      .select("*, users(*)")
      .eq("slug", teste)
      .single();

    if (error || !product) {
      return {
        title: "Produto não encontrado | OLX Brasil",
        description: "O produto que você está procurando não foi encontrado.",
      };
    }

    const formattedPrice = product.price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const title = `${product.title} - ${formattedPrice} | OLX Brasil`;
    const description =
      product.description ||
      `${product.title} por ${formattedPrice}. ${product.brand || ""} ${
        product.model || ""
      } em ${product.city || "Brasil"}. Pague online com garantia OLX.`;

    return {
      title,
      description,
      keywords: [
        product.title,
        product.brand,
        product.model,
        product.category,
        product.city,
        "OLX",
        "comprar",
        "vender",
        "marketplace",
      ]
        .filter(Boolean)
        .join(", "),
      authors: [{ name: "OLX Brasil" }],
      creator: "OLX Brasil",
      publisher: "OLX Brasil",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      openGraph: {
        title,
        description,
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://olx.com.br"
        }/product/${product.slug}`,
        siteName: "OLX Brasil",
        images: [
          {
            url: product.images[0] || "/favicon.ico",
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
        locale: "pt_BR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [product.images[0] || "/favicon.ico"],
        creator: "@olxbrasil",
        site: "@olxbrasil",
      },
      alternates: {
        canonical: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://olx.com.br"
        }/product/${product.slug}`,
      },
      other: {
        "product:price:amount": product.price.toString(),
        "product:price:currency": "BRL",
        "product:availability": product.stock > 0 ? "instock" : "outofstock",
        "product:condition": product.condition || "used",
        ...(product.brand && { "product:brand": product.brand }),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Erro | OLX Brasil",
      description: "Ocorreu um erro ao carregar o produto.",
    };
  }
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto">{children}</main>
    </div>
  );
}
