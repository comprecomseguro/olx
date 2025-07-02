"use client";

import { supabase } from "@/supabase";
import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import QRCode from "react-qr-code";
import { useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function PixPayment() {
  const params = useParams();
  const slug = params?.slug as string;
  const [seconds, setSeconds] = useState(3600); // 1 hora
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(true); // Loading inicial
  const [product, setProduct] = useState<Global.Product | null>(null);
  const [copied, setCopied] = useState(false);

  // Simula carregamento de geração do Pix
  useEffect(() => {
    const timer = setTimeout(() => setGenerating(false), 10000); // 10s
    return () => clearTimeout(timer);
  }, []);

  // Fetch dos dados do produto
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, users(*)")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Erro ao buscar produto:", error);
        return;
      }

      setProduct(data);
      setLoading(false);

      document.title = data.title;

      const descriptionTag = document.querySelector("meta[name='description']");
      if (descriptionTag) {
        descriptionTag.setAttribute("content", data.description);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = data.description;
        document.head.appendChild(meta);
      }

      const ogTitle = document.querySelector("meta[property='og:title']");
      if (ogTitle) {
        ogTitle.setAttribute("content", data.title);
      } else {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:title");
        meta.content = data.title;
        document.head.appendChild(meta);
      }

      const ogImage = document.querySelector("meta[property='og:image']");
      if (ogImage) {
        ogImage.setAttribute("content", data.image_url);
      } else {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:image");
        meta.content = data.image_url;
        document.head.appendChild(meta);
      }
    };

    fetchProduct();
  }, [slug]);

  // Timer
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  // Formata o tempo (mm:ss ou hh:mm:ss)
  const formatTime = () => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(product?.pix ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // volta para "Copiar" após 3 segundos
  };
  // Timeout expirado
  if (seconds <= 0) {
    return <PixExpired />;
  }

  if (loading || !product || generating) {
    return <Loading text="Estamos gerando seu código PIX. Aguarde..." />;
  }

  return (
    <div className="min-h-screen bg-white h-full mt-20 scale-110">
      <div className="max-w-[500px] w-full border bg-white border-gray-400/40 rounded-lg p-6 mx-auto ">
        {/* Aviso */}
        <div className="flex items-start gap-3 bg-yellow-50 p-3 rounded">
          <span className="text-yellow-600 font-bold text-lg scale-90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M12,22.75 C6.06293894,22.75 1.25,17.9370611 1.25,12 C1.25,6.06293894 6.06293894,1.25 12,1.25 C17.9370611,1.25 22.75,6.06293894 22.75,12 C22.75,17.9370611 17.9370611,22.75 12,22.75 Z M12,21.25 C17.1086339,21.25 21.25,17.1086339 21.25,12 C21.25,6.89136606 17.1086339,2.75 12,2.75 C6.89136606,2.75 2.75,6.89136606 2.75,12 C2.75,17.1086339 6.89136606,21.25 12,21.25 Z M11.25,8 C11.25,7.58578644 11.5857864,7.25 12,7.25 C12.4142136,7.25 12.75,7.58578644 12.75,8 L12.75,12 C12.75,12.4142136 12.4142136,12.75 12,12.75 C11.5857864,12.75 11.25,12.4142136 11.25,12 L11.25,8 Z M12,16 C11.4477153,16 11,15.5522847 11,15 C11,14.4477153 11.4477153,14 12,14 C12.5522847,14 13,14.4477153 13,15 C13,15.5522847 12.5522847,16 12,16 Z"
              ></path>
            </svg>
          </span>
          <p className="text-[12px] text-yellow-800">
            Não pedimos comprovante do Pix e nem enviamos por e-mail. A OLX, em
            parceria com a <strong>Zoop Tecnologia</strong>, cuida do pagamento
            até você receber seu produto!
          </p>
        </div>

        {/* Tempo */}
        <div className="flex justify-center font-extrabold gap-2 items-center border-t-4 border-gray-500 bg-gray-100 p-2 px-4 mt-4">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              color="#999999"
            >
              <path
                fill="#999999"
                fill-rule="evenodd"
                d="M12,22.75 C6.06293894,22.75 1.25,17.9370611 1.25,12 C1.25,6.06293894 6.06293894,1.25 12,1.25 C17.9370611,1.25 22.75,6.06293894 22.75,12 C22.75,17.9370611 17.9370611,22.75 12,22.75 Z M12,21.25 C17.1086339,21.25 21.25,17.1086339 21.25,12 C21.25,6.89136606 17.1086339,2.75 12,2.75 C6.89136606,2.75 2.75,6.89136606 2.75,12 C2.75,17.1086339 6.89136606,21.25 12,21.25 Z M12.75,6 L12.75,11.6893398 L15.5303301,14.4696699 C15.8232233,14.7625631 15.8232233,15.2374369 15.5303301,15.5303301 C15.2374369,15.8232233 14.7625631,15.8232233 14.4696699,15.5303301 L11.4696699,12.5303301 C11.3290176,12.3896778 11.25,12.1989124 11.25,12 L11.25,6 C11.25,5.58578644 11.5857864,5.25 12,5.25 C12.4142136,5.25 12.75,5.58578644 12.75,6 Z"
              ></path>
            </svg>
          </span>
          <span className="text-[12px] text-gray-500">
            Seu código expira em:
          </span>
          <span className="text-[12px] text-[#f28000] font-extrabold">
            {formatTime()}
          </span>
        </div>

        {/* Valor */}
        <div className="flex justify-center gap-8 items-center mt-5">
          <div className="flex items-center gap-2">
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="scale-75"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.5455 10.6243C12.2257 10.6243 13.8056 11.2787 14.9938 12.4661L21.4404 18.9141C21.9047 19.3781 22.6628 19.3802 23.1285 18.9134L29.5516 12.4896C30.7398 11.3022 32.3197 10.6478 34.0002 10.6478H34.7738L26.6152 2.48957C24.0745 -0.0512111 19.9554 -0.0512111 17.4147 2.48957L9.27995 10.6243H10.5455ZM34.0006 33.3392C32.3201 33.3392 30.7401 32.6848 29.552 31.4973L23.1288 25.0742C22.678 24.622 21.892 24.6233 21.4411 25.0742L14.9941 31.5208C13.806 32.7083 12.226 33.3623 10.5458 33.3623H9.27995L17.415 41.4977C19.9558 44.0382 24.0751 44.0382 26.6156 41.4977L34.7741 33.3392H34.0006ZM36.5771 12.4594L41.5069 17.3896C44.0477 19.9301 44.0477 24.0494 41.5069 26.5902L36.5771 31.5201C36.4682 31.4766 36.3511 31.4496 36.2267 31.4496H33.9855C32.8263 31.4496 31.6921 30.9798 30.8733 30.1599L24.4501 23.7375C23.2858 22.5721 21.255 22.5724 20.0896 23.7368L13.643 30.1837C12.8238 31.0029 11.6896 31.4728 10.5308 31.4728H7.77439C7.65692 31.4728 7.54671 31.5008 7.44306 31.5398L2.49348 26.5902C-0.0473047 24.0494 -0.0473047 19.9301 2.49348 17.3896L7.44341 12.4397C7.54705 12.4788 7.65692 12.5067 7.77439 12.5067H10.5308C11.6896 12.5067 12.8238 12.9766 13.643 13.7958L20.0903 20.2431C20.6911 20.8436 21.4802 21.1445 22.27 21.1445C23.0592 21.1445 23.849 20.8436 24.4498 20.2428L30.8733 13.8193C31.6921 12.9998 32.8263 12.5299 33.9855 12.5299H36.2267C36.3508 12.5299 36.4682 12.5029 36.5771 12.4594Z"
                fill="#32BCAD"
              ></path>
            </svg>

            <div>
              <p className="text-sm">Pague por Pix</p>
              <p className="font-extrabold text-sm">
                R$ {(product.price + 10).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              {" "}
              <div
                className="w-10 h-10 bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: 'url("/zoop.png")' }}
              />
            </div>
            <div>
              <p className="text-sm">Processado por</p>
              <p className="text-sm font-extrabold">Zoop tecnologia</p>
            </div>
          </div>
        </div>

        <hr className="my-5 border-gray-200" />

        {/* Instruções */}
        <div className="space-y-3 text-[12px] text-gray-700">
          <p>É rápido e prático. Veja como é fácil:</p>
          <ol className="list-decimal list-inside space-y-3">
            <li>
              Abra o app ou banco de sua preferência, escolha a opção pagar via
              Pix.
            </li>
            <li>Escolha pagar Pix com QR Code e escaneie o código abaixo:</li>
            <li>
              Confira se o pagamento será feito para nossa parceira{" "}
              <strong>Zoop Tecnologia</strong> e se todas as informações estão
              corretas.
            </li>
            <li>Confirme o pagamento.</li>
          </ol>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mt-8">
          <QRCode value={product.pix ?? ""} size={180} />
        </div>

        <hr className="my-6 border-gray-200" />
        {/* Copia e cola */}
        <div className="mt-5">
          <p className="text-sm font-extrabold mb-2">
            Ou se preferir, faça o pagamento com o Pix copia e cola
          </p>
          <p className="text-[12px] text-gray-600 mb-3">
            Acesse o app do seu banco ou Internet Banking, escolha a opção pagar
            com <strong>Pix copia e cola</strong>. Depois cole o código, confira
            se o pagamento será feito para nossa parceira{" "}
            <strong className="text-[#f28000]">Zoop</strong> e confirme.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between p-2">
            <span className="text-[12px] truncate">{product.pix ?? ""}</span>
            <button
              onClick={handleCopy}
              className="text-[#6e0ad6] text-[12px] font-semibold cursor-pointer"
            >
              <BiCopy className="inline-block w-4 h-4 mr-1" />
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="w-full mt-3 bg-[#f28000] cursor-pointer hover:bg-orange-600 text-white py-2 rounded-full text-sm font-medium"
          >
            {copied ? "Copiado!" : "Copiar código Pix"}
          </button>

          <p className="text-xs text-center text-gray-500 mt-5">
            Prontinho! A aprovação é imediata e você pode acompanhar o seu
            pedido em{" "}
            <span className="text-[#6e0ad6] underline cursor-pointer">
              Minhas Compras
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function PixExpired() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Conteúdo */}
      <div className="flex flex-col items-center text-center mt-16">
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_11748:65809)">
            <rect width="96" height="96" fill="white"></rect>
            <path
              opacity="0.2"
              d="M75.9089 92.2399L7.03821 81.004C3.85467 80.474 1.73231 77.506 2.2629 74.3261L13.4053 5.53276C13.9359 2.35279 16.9072 0.232811 20.0907 0.762806L88.9614 11.9987C92.145 12.5287 94.2673 15.4967 93.7368 18.6766L82.5943 87.3639C82.1699 90.5439 79.0924 92.7699 75.9089 92.2399Z"
              fill="#F28000"
            ></path>
            <path
              d="M65.1019 52.9627L58.2257 35.3735C57.4189 33.3192 57.702 30.418 59.7116 29.3552C60.3532 29.0049 60.9221 28.7516 61.6115 28.7414L58.2296 4.67822C57.9189 2.46747 55.793 0.858674 53.5065 1.18002L26.1534 5.02424C23.867 5.34559 22.2549 7.39303 22.5775 9.68881L30.5362 66.318C30.8469 68.5288 32.9729 70.1376 35.2594 69.8162L60.2413 66.3052C62.0071 59.2071 65.1019 52.9627 65.1019 52.9627Z"
              fill="white"
            ></path>
            <path
              d="M51.8699 22.1179C52.5918 27.2549 49.0239 32.0031 43.9007 32.7231C38.7774 33.4431 34.039 29.8624 33.317 24.7253C32.595 19.5882 36.163 14.8401 41.2862 14.1201C46.4094 13.4001 51.1479 16.9808 51.8699 22.1179Z"
              fill="#E1E1E1"
            ></path>
            <path
              d="M46.7158 26.3314C46.2125 26.4022 45.7116 26.2722 45.3057 25.9655L43.1106 24.3069C42.9565 24.19 42.7211 24.2236 42.6051 24.3779L40.9463 26.5854C40.6406 26.992 40.1949 27.255 39.6916 27.3258L39.3125 27.379L42.0925 29.4798C42.9607 30.1359 44.1945 29.9625 44.8483 29.0925L46.9476 26.2989L46.7158 26.3314Z"
              fill="#F28000"
            ></path>
            <path
              d="M38.7332 20.4949C39.2364 20.4242 39.7374 20.5542 40.1433 20.8608L42.3464 22.5259C42.505 22.6458 42.7322 22.6145 42.8519 22.4547L44.5046 20.2551C44.8104 19.8484 45.256 19.5854 45.7593 19.5147L45.991 19.4821L43.2031 17.3753C42.3349 16.7192 41.1011 16.8926 40.4473 17.7626L38.3541 20.5482L38.7332 20.4949Z"
              fill="#F28000"
            ></path>
            <path
              d="M48.2113 21.4302L46.5723 20.3719C46.5417 20.3876 46.5079 20.3995 46.4711 20.4046L45.8067 20.498C45.4631 20.5463 45.1438 20.714 44.9306 20.9581L43.258 22.8721C43.1015 23.0512 42.8783 23.1612 42.6444 23.1941C42.4102 23.227 42.1655 23.1827 41.9657 23.0539L39.8223 21.6699C39.5501 21.4941 39.1969 21.4209 38.8534 21.4691L38.0364 21.584C38.0016 21.5889 37.968 21.5863 37.9358 21.5806L36.6469 23.0555C35.9853 23.8125 36.1337 24.8683 36.9783 25.4137L38.6238 26.4761C38.6531 26.4618 38.6848 26.4501 38.7196 26.4452L39.5366 26.3304C39.8801 26.2821 40.1994 26.1144 40.4127 25.8703L42.0914 23.9494C42.3948 23.6024 42.9969 23.5176 43.3839 23.7679L45.5192 25.1464C45.7915 25.3224 46.1447 25.3956 46.4882 25.3473L47.1526 25.2539C47.1894 25.2487 47.2252 25.2508 47.259 25.2574L48.5427 23.7885C49.2043 23.0313 49.0559 21.9755 48.2113 21.4302Z"
              fill="#F28000"
            ></path>
            <path
              d="M78.122 49.7446C74.5278 43.8333 70.9455 38.0071 67.3513 32.0958C66.664 30.8918 65.9886 29.7728 64.6107 29.186C61.4078 27.902 58.0402 30.9765 58.8569 34.3301C59.5173 37.1854 61.0364 40.0067 62.0236 42.7293C63.3603 46.0965 64.6244 49.5606 65.9612 52.9277C63.535 57.1706 61.8699 61.9134 60.8943 66.6461L39.0457 69.7167C40.434 78.3658 51.8218 88.7311 51.8218 88.7311C54.4668 90.9606 57.2759 96.2019 57.2759 96.2019L84.2903 92.4052C82.4724 87.4582 81.6047 85.5859 80.9485 80.3022C80.1489 73.9982 80.6076 67.4306 80.8481 61.1538C80.8912 57.1592 80.2568 53.2597 78.122 49.7446Z"
              fill="white"
            ></path>
            <path
              d="M57.2869 96.2879C57.2869 96.2879 54.5385 90.8647 51.8327 88.8172C48.2573 86.1114 40.4449 78.4519 39.0566 69.8027"
              fill="white"
            ></path>
            <path
              d="M57.3834 96.9674C57.1293 97.0031 56.8514 96.8688 56.7308 96.6256C56.7189 96.5405 54.0791 91.2755 51.4819 89.3861C47.3147 86.1566 39.853 78.5344 38.4647 69.8853C38.4169 69.5452 38.6232 69.1694 38.9619 69.1218C39.3007 69.0742 39.6753 69.2816 39.7231 69.6218C41.0396 77.7607 48.2114 85.1635 52.27 88.2348C55.0724 90.3555 57.8089 95.6937 57.9294 95.9369C58.0619 96.2651 57.9403 96.629 57.6255 96.8467C57.5527 96.9436 57.4681 96.9555 57.3834 96.9674Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M59.9547 77.8971C57.399 65.857 65.1021 52.4619 65.1021 52.4619L58.1422 34.2775C57.3354 32.2232 58.2222 29.9308 60.1471 28.8799C62.1567 27.8171 64.6712 28.5042 65.8049 30.4259L77.2629 49.2787C79.06 52.2344 79.9614 55.576 80.016 59.0367C80.016 59.0367 79.4083 74.9897 80.1492 80.2615C80.675 84.0028 83.5278 92.0125 83.5278 92.0125"
              fill="white"
            ></path>
            <path
              d="M83.5405 92.7047C83.2864 92.7404 82.9238 92.6179 82.876 92.2778C82.7435 91.9496 80.0112 84.183 79.4735 80.3567C78.7325 75.0849 79.3273 59.654 79.413 59.035C79.3823 55.7444 78.4929 52.4877 76.7077 49.6171L65.2617 30.8493C64.2485 29.1708 62.0966 28.6062 60.4138 29.5364C58.8038 30.3696 58.0505 32.383 58.7249 34.1091L65.6847 52.2935C65.7933 52.4517 65.7445 52.7187 65.6717 52.8156C65.599 52.9125 58.0414 66.1138 60.5493 77.8138C60.5971 78.1539 60.3909 78.5298 60.0521 78.5774C59.7134 78.625 59.3388 78.4175 59.291 78.0774C56.8309 66.7175 63.3105 54.4481 64.4145 52.4721L57.5871 34.6159C56.6597 32.3184 57.6681 29.6621 59.9198 28.4786C62.2561 27.2832 65.1214 28.0077 66.4722 30.2457L77.9063 48.9284C79.7153 51.9691 80.7253 55.4689 80.7919 59.0146C80.8158 59.1847 80.1961 75.0527 80.9131 80.1544C81.4269 83.8106 84.1831 91.7473 84.1951 91.8323C84.3276 92.1605 84.1213 92.5363 83.7945 92.669C83.6252 92.6928 83.5405 92.7047 83.5405 92.7047Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M27.146 40.3479C26.8073 40.3955 26.4327 40.188 26.373 39.7628L22.1068 9.40755C21.7961 7.19681 23.3116 5.07624 25.5981 4.75489L53.6286 0.815456C55.8304 0.506014 57.9444 2.02978 58.2671 4.32556L61.6609 28.4737C61.7087 28.8139 61.5024 29.1897 61.079 29.2492C60.6556 29.3087 60.3657 29.0893 60.3059 28.6642L56.9121 4.51599C56.697 2.98547 55.2475 1.88856 53.7232 2.10279L25.862 6.01842C24.3377 6.23265 23.2467 7.68661 23.4618 9.21713L27.7399 39.6574C27.7877 39.9976 27.4848 40.3003 27.146 40.3479Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M59.9591 67.4687L36.4893 70.7672C36.1645 70.8129 35.8038 70.6034 35.744 70.1783C35.6843 69.7531 35.8921 69.4638 36.2981 69.4067L59.7679 66.1083C60.0927 66.0626 60.4534 66.272 60.5132 66.6972C60.5729 67.1223 60.2839 67.4231 59.9591 67.4687Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M26.0581 32.6069C26.0581 32.6069 17.5491 29.2072 17.7745 24.6667C18 20.1262 24.5882 22.1483 24.5882 22.1483L26.0581 32.6069Z"
              fill="white"
            ></path>
            <path
              d="M26.1422 33.2036C26.0576 33.2155 25.8882 33.2393 25.7916 33.1662C25.4289 33.0437 16.8113 29.4859 17.0737 24.5934C17.1604 23.3672 17.6337 22.4337 18.4935 21.7926C20.6974 20.2689 24.5659 21.3727 24.7472 21.4339C25.0132 21.4832 25.1337 21.7264 25.1696 21.9815L26.6394 32.44C26.6753 32.6951 26.6145 32.8771 26.3724 32.9978C26.3963 33.1679 26.3116 33.1798 26.1422 33.2036ZM20.7301 22.3453C20.222 22.4167 19.6412 22.5851 19.2536 22.8997C18.7086 23.3231 18.4416 23.8809 18.3798 24.6699C18.266 27.5473 22.6156 30.2309 25.2138 31.5132L23.9591 22.5852C23.2457 22.4253 21.831 22.1906 20.7301 22.3453Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M30.6341 60.2323C30.6341 60.2323 28.2998 60.2135 26.8581 61.6301C25.4164 63.0466 24.5774 65.679 26.9792 68.6364C28.0292 69.9629 34.2756 73.854 35.8171 70.6892C37.504 67.3307 30.6539 62.8308 30.6539 62.8308L30.6341 60.2323Z"
              fill="white"
            ></path>
            <path
              d="M34.2511 72.4696L34.1664 72.4815C31.4446 72.7773 27.4457 70.1311 26.5043 68.9628C23.9819 65.7622 24.7731 62.7896 26.433 61.0823C28.0202 59.4719 30.5239 59.4669 30.6086 59.455C30.9592 59.4924 31.2491 59.7118 31.2123 60.0638L31.1842 62.3222C32.5252 63.2609 38.0214 67.3441 36.2617 70.7996C35.9817 71.8795 35.1827 72.3386 34.2511 72.4696ZM29.9529 60.9345C29.2754 61.0297 28.1018 61.2813 27.3506 62.0806C26.5993 62.8798 25.0111 65.0973 27.5215 68.2128C28.2577 69.1499 31.9548 71.4917 33.9872 71.206C34.58 71.1227 34.9795 70.8931 35.2585 70.4204C36.3994 68.0923 32.0997 64.5346 30.2995 63.4003C30.1062 63.2541 29.9976 63.0959 30.0464 62.8289L29.9529 60.9345Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M28.5598 50.38C28.5598 50.38 26.1408 50.3731 24.711 51.8747C23.1966 53.3881 22.7192 56.7501 24.4924 59.5357C25.4816 61.0442 32.26 65.0339 33.8383 61.5172C35.4167 58.0004 28.8346 52.3356 28.8346 52.3356L28.5598 50.38Z"
              fill="white"
            ></path>
            <path
              d="M32.0429 63.5032C31.9582 63.5151 31.8735 63.527 31.7889 63.5389C28.9704 63.7616 24.8141 61.2242 23.9334 59.8739C21.955 56.8571 22.554 53.1311 24.2139 51.4238C25.8738 49.7165 28.4741 49.7846 28.5588 49.7727C28.9095 49.8101 29.1147 50.0414 29.1505 50.2965L29.3776 51.912C30.5731 53.0446 35.9467 58.0989 34.2956 61.7126C34.0036 62.7074 33.1438 63.3485 32.0429 63.5032ZM27.8792 51.0821C27.1171 51.1892 25.9554 51.5259 25.2042 52.3251C23.9199 53.6328 23.4793 56.6429 25.0473 59.1972C25.6988 60.1461 29.3959 62.4879 31.7062 62.3366C32.4684 62.2295 33.0373 61.9761 33.2924 61.3333C34.3974 58.7502 30.2442 54.3915 28.4809 52.9051C28.3842 52.832 28.2757 52.6738 28.2518 52.5038L28.0725 51.2284C27.9639 51.0702 27.9639 51.0702 27.8792 51.0821Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M27.1369 40.2611C27.1369 40.2611 24.7179 40.2543 23.2882 41.7558C21.8584 43.2574 21.6829 46.9238 23.0695 49.4169C23.9013 51.0342 30.606 55.7279 32.3178 51.9323C34.1144 48.1248 27.4118 42.2168 27.4118 42.2168L27.1369 40.2611Z"
              fill="white"
            ></path>
            <path
              d="M30.5224 53.9177C30.353 53.9415 30.2683 53.9534 30.0989 53.9772C27.1719 54.0417 23.1979 50.9585 22.4986 49.6694C21.0033 47.0182 21.2158 42.9998 22.791 41.3043C24.4509 39.597 27.0512 39.6651 27.1359 39.6532C27.4866 39.6906 27.6918 39.9219 27.7277 40.177L27.9547 41.7925C29.0535 42.852 34.6443 48.2226 32.8597 52.1152C32.3984 53.1338 31.6233 53.763 30.5224 53.9177ZM26.4564 40.9626C25.6942 41.0697 24.5325 41.4064 23.7813 42.2057C22.497 43.5134 22.4549 46.9009 23.6244 49.0777C24.0946 49.9654 27.682 52.7561 30.0891 52.678C30.8632 52.6559 31.4201 52.3175 31.7479 51.5777C32.9984 48.8007 28.7247 44.1989 27.0341 42.6156C26.9375 42.5425 26.8289 42.3843 26.805 42.2143L26.6257 40.9388C26.541 40.9507 26.541 40.9507 26.4564 40.9626Z"
              fill="#4A4A4A"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M37.3887 7.20464C37.3394 6.85895 37.5797 6.53875 37.9254 6.48946L42.8665 5.78504C43.2122 5.73575 43.5324 5.97604 43.5817 6.32174C43.6309 6.66744 43.3906 6.98764 43.045 7.03692L38.1039 7.74135C37.7582 7.79063 37.438 7.55034 37.3887 7.20464Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M36.7468 45.6408L35.5039 36.7969L38.9177 36.3171C39.8477 36.1864 40.5897 36.3166 41.1438 36.7078C41.706 37.0979 42.0471 37.7194 42.1669 38.5724C42.2856 39.4171 42.1291 40.1086 41.6973 40.6468C41.2725 41.1756 40.5952 41.5053 39.6653 41.636L37.2548 41.9748L37.7502 45.4998L36.7468 45.6408ZM37.1331 41.1092L39.4212 40.7876C40.759 40.5996 41.3439 39.9076 41.1758 38.7117C41.0066 37.5074 40.2531 36.9993 38.9153 37.1873L36.6271 37.5089L37.1331 41.1092Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M44.4899 44.5526L43.247 35.7087L44.2503 35.5676L45.4932 44.4116L44.4899 44.5526Z"
              fill="#4A4A4A"
            ></path>
            <path
              d="M46.6784 44.245L49.3229 39.2681L45.5945 35.3787L46.7692 35.2136L49.801 38.4078L51.8104 34.5051L52.9973 34.3383L50.4731 39.1064L54.387 43.1616L53.2002 43.3284L50.0073 39.965L47.8775 44.0765L46.6784 44.245Z"
              fill="#4A4A4A"
            ></path>
            <rect
              x="36.0215"
              y="54.873"
              width="23.7514"
              height="5.9539"
              rx="2.97695"
              transform="rotate(-8 36.0215 54.873)"
              fill="#F28000"
            ></rect>
            <path
              d="M90.5536 1.50586H68.0658C65.4404 1.50586 63.2715 3.56929 63.2715 6.06713V22.0316C63.2715 24.5294 65.4404 26.5928 68.0658 26.5928H71.1479C71.4904 26.5928 71.7187 26.81 71.7187 27.1358V33.1089C71.7187 33.6519 72.4036 33.8691 72.746 33.5433L79.8234 26.81C79.9375 26.7014 80.0517 26.7014 80.28 26.7014H90.6677C93.2932 26.7014 95.462 24.638 95.462 22.1402V6.06713C95.3479 3.56929 93.179 1.50586 90.5536 1.50586Z"
              fill="#F28000"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M73.2439 8.18377C73.8476 7.56114 74.8266 7.56114 75.4303 8.18377L85.0503 18.104C85.6541 18.7266 85.6541 19.7361 85.0503 20.3587C84.4465 20.9814 83.4676 20.9814 82.8638 20.3587L73.2439 10.4385C72.6401 9.81588 72.6401 8.8064 73.2439 8.18377Z"
              fill="white"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M73.6821 20.3594C73.0784 19.7367 73.0784 18.7272 73.6821 18.1046L83.3021 8.1844C83.9059 7.56177 84.8848 7.56177 85.4886 8.1844C86.0924 8.80702 86.0924 9.81651 85.4886 10.4391L75.8686 20.3594C75.2648 20.982 74.2859 20.982 73.6821 20.3594Z"
              fill="white"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_11748:65809">
              <rect width="96" height="96" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
        <h2 className="text-lg font-semibold mt-4">O código Pix expirou</h2>
        <p className="text-sm text-gray-600 max-w-[400px] mt-2">
          O prazo para pagamento do seu pedido expirou, volte ao anúncio e
          realize a compra novamente. Se você já pagou, aguarde a confirmação em
          detalhes da compra.
        </p>
        {/* Botões */}
        <div className="flex flex-col gap-3 mt-6 w-full max-w-[300px]">
          <a
            href="/"
            className="bg-orange-500 text-white rounded-full py-3 text-sm font-semibold hover:bg-orange-600 transition"
          >
            Ver anúncio
          </a>
          <a
            href="/detalhes"
            className="text-sm text-[#6e0ad6] font-semibold hover:underline"
          >
            Detalhes da compra
          </a>
        </div>
      </div>
    </div>
  );
}
