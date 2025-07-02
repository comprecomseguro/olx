"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { format } from "date-fns";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";

const ProductCarousel = () => {
  const [products, setProducts] = useState<Global.Product[]>([]);
  const router = useRouter();

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar produtos:", error);
    } else {
      setProducts(data as Global.Product[]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2.25,
        },
      },
    ],
  };

  return (
    <div className="w-full py-12 border-b border-[#cfd4dd]">
      <h2 className="text-xl mb-6">Também podem te interessar</h2>
      <Slider {...settings}>
        {products.map((product) => (
          <div
            onClick={() => router.push(`/produto/${product.slug}`)}
            key={product.id}
            className="cursor-pointer mx-2 max-w-[202px] min-h-[394px]"
          >
            <div className="border border-gray-300 min-h-[394px] rounded-lg overflow-hidden hover:shadow-md transition">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-[202px] h-[180px] object-cover"
              />
              <div className="p-4 flex flex-col justify-between min-h-[214px]">
                <p className="text-lg font-semibold">
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-sm text-gray-700">{product.title}</p>
                <span className="inline-block mt-2 bg-[#F0E6FF] text-[#6e0ad6] text-xs px-2 py-1 rounded w-fit font-semibold">
                  Entrega fácil
                </span>

                <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                  <span className="flex gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M17.0444645,19.6408084 C16.0341578,20.7072432 14.9539241,21.6794535 13.8734451,22.539835 C13.4948263,22.8413277 13.1427142,23.1076689 12.8258367,23.3365249 C12.6334551,23.4754671 12.4939372,23.5720962 12.4160251,23.6240376 C12.1641006,23.7919873 11.8358994,23.7919873 11.5839749,23.6240376 C11.5060628,23.5720962 11.3665449,23.4754671 11.1741633,23.3365249 C10.8572858,23.1076689 10.5051737,22.8413277 10.1265549,22.539835 C9.04607586,21.6794535 7.96584218,20.7072432 6.95553549,19.6408084 C4.02367618,16.546068 2.25,13.2943283 2.25,9.99999985 C2.25,4.6152236 6.61522375,0.25 12,0.25 C17.3847763,0.25 21.75,4.6152236 21.75,9.99999985 C21.75,13.2943283 19.9763238,16.546068 17.0444645,19.6408084 Z M12.9390549,21.3664148 C13.9679509,20.5471087 14.9970922,19.6208815 15.9555355,18.6091914 C18.6486762,15.7664318 20.25,12.8306714 20.25,9.99999987 C20.25,5.44365074 16.5563491,1.75 12,1.75 C7.44365086,1.75 3.75,5.44365074 3.75,9.99999987 C3.75,12.8306714 5.35132382,15.7664318 8.04446451,18.6091914 C9.00290782,19.6208815 10.0320491,20.5471087 11.0609451,21.3664148 C11.3996944,21.6361596 11.7151776,21.87558 12,22.0825458 C12.2848224,21.87558 12.6003056,21.6361596 12.9390549,21.3664148 Z M12,13.7499999 C9.92893219,13.7499999 8.25,12.0710677 8.25,9.99999987 C8.25,7.92893205 9.92893219,6.24999987 12,6.24999987 C14.0710678,6.24999987 15.75,7.92893205 15.75,9.99999987 C15.75,12.0710677 14.0710678,13.7499999 12,13.7499999 Z M12,12.2499999 C13.2426407,12.2499999 14.25,11.2426406 14.25,9.99999987 C14.25,8.75735918 13.2426407,7.74999987 12,7.74999987 C10.7573593,7.74999987 9.75,8.75735918 9.75,9.99999987 C9.75,11.2426406 10.7573593,12.2499999 12,12.2499999 Z"
                      ></path>
                    </svg>{" "}
                    {product.neighborhood} - {product.city} - {product.state}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {" "}
                  {format(new Date(product.created_at), "dd/MM/yyyy, HH:mm")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
