import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";

interface ModalProps {
  onClose: () => void;
  images: string[];
  old_price: number | null;
  price: number;
  slug: string;
}

function Modal({ onClose, images, old_price, price, slug }: ModalProps) {
  const sliderRef = useRef<Slider>(null);
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const settings = {
    dots: false, // remove os dots padrão
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index: number) => setCurrent(index), // atualiza slide atual
    arrows: false, // opcional: esconde setas padrões
  };

  return (
    <div className="fixed h-screen bg-white z-50 top-0 left-0 w-full py-8 flex flex-col">
      <div className="flex w-full justify-between px-6 text-black">
        <p>
          {current + 1}/{images.length}
        </p>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-300/70 cursor-pointer rounded-full -mt-2"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M13.0606602,12 L18.5303301,17.4696699 C18.8232233,17.7625631 18.8232233,18.2374369 18.5303301,18.5303301 C18.2374369,18.8232233 17.7625631,18.8232233 17.4696699,18.5303301 L12,13.0606602 L6.53033009,18.5303301 C6.23743687,18.8232233 5.76256313,18.8232233 5.46966991,18.5303301 C5.1767767,18.2374369 5.1767767,17.7625631 5.46966991,17.4696699 L10.9393398,12 L5.46966991,6.53033009 C5.1767767,6.23743687 5.1767767,5.76256313 5.46966991,5.46966991 C5.76256313,5.1767767 6.23743687,5.1767767 6.53033009,5.46966991 L12,10.9393398 L17.4696699,5.46966991 C17.7625631,5.1767767 18.2374369,5.1767767 18.5303301,5.46966991 C18.8232233,5.76256313 18.8232233,6.23743687 18.5303301,6.53033009 L13.0606602,12 L13.0606602,12 Z"
            ></path>
          </svg>
        </button>
      </div>

      <figure className="mt-6 h-fit">
        <Slider ref={sliderRef} {...settings}>
          {images.map((url, index) => (
            <div key={index}>
              <div
                className="w-full h-[70vh] bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${url})` }}
              />
            </div>
          ))}
        </Slider>
      </figure>

      {/* Miniaturas como botões */}
      <div className="mt-4 flex justify-center items-center gap-4 duration-300 h-[123px] px-6 ">
        {images.map((url, index) => (
          <div
            key={index}
            onClick={() => sliderRef.current?.slickGoTo(index)}
            className={`bg-cover bg-center rounded-xl cursor-pointer duration-300 ${
              current === index
                ? "grayscale-0 h-[78px] w-[78px]"
                : "h-[61px] w-[61px] grayscale-50"
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center border-t border-gray-300 p-4 pb-8">
        <div>
          <p className="text-gray-500 line-through text-[12px] font-semibold">
            {old_price?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-[24px] font-semibold text-black">
            {price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <button
          onClick={() => router.push(`/pagamento/${slug}`)}
          className="bg-[#f28000] cursor-pointer text-white px-6 py-2 rounded-full hover:bg-[#ffbb73] transition flex justify-center items-center gap-3"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.25524 22.9998C6.83342 22.9998 5.6808 21.8471 5.6808 20.4253C5.6808 19.0035 6.83342 17.8509 8.25524 17.8509C9.67706 17.8509 10.8297 19.0035 10.8297 20.4253C10.8297 21.8471 9.67706 22.9998 8.25524 22.9998ZM8.25524 21.5955C8.90152 21.5955 9.42544 21.0716 9.42544 20.4253C9.42544 19.779 8.90152 19.2551 8.25524 19.2551C7.60896 19.2551 7.08504 19.779 7.08504 20.4253C7.08504 21.0716 7.60896 21.5955 8.25524 21.5955ZM19.4892 22.9998C18.0673 22.9998 16.9147 21.8471 16.9147 20.4253C16.9147 19.0035 18.0673 17.8509 19.4892 17.8509C20.911 17.8509 22.0636 19.0035 22.0636 20.4253C22.0636 21.8471 20.911 22.9998 19.4892 22.9998ZM19.4892 21.5955C20.1354 21.5955 20.6594 21.0716 20.6594 20.4253C20.6594 19.779 20.1354 19.2551 19.4892 19.2551C18.8429 19.2551 18.319 19.779 18.319 20.4253C18.319 21.0716 18.8429 21.5955 19.4892 21.5955ZM6.68032 5.6808H22.2976C22.7408 5.6808 23.0731 6.08626 22.9861 6.52078L21.4136 14.3741C21.1706 15.5972 20.0859 16.4704 18.8526 16.4466L8.96332 16.4466C7.66256 16.4576 6.55793 15.4966 6.38895 14.2074L4.96591 3.42231C4.88963 2.84049 4.39422 2.40513 3.80848 2.40424H1.70212C1.31435 2.40424 1 2.08989 1 1.70212C1 1.31435 1.31435 1 1.70212 1L3.80954 1C5.10051 1.00196 6.19041 1.95975 6.35816 3.23919L6.68032 5.6808ZM7.78121 14.0244C7.85805 14.6106 8.36015 15.0474 8.95736 15.0424L18.866 15.0425C19.4328 15.0534 19.9258 14.6565 20.0364 14.0994L21.441 7.08504H6.8656L7.78121 14.0244Z"
              fill="currentColor"
            ></path>
          </svg>
          Comprar
        </button>
      </div>
    </div>
  );
}

export default Modal;
