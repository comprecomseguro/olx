"use client";
import { supabase } from "@/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loading from "../../components/loading";
import { useParams } from "next/navigation";

interface Address {
  id: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  pontoReferencia: string;
  enderecoPrincipal: boolean;
}

export default function Checkout() {
  const params = useParams();
  const slug = params?.slug as string;
  const [deliveryOption, setDeliveryOption] = useState("retirar");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [isAddressMenuOpen, setIsAddressMenuOpen] = useState(false);
  const [isAddressMenuClosing, setIsAddressMenuClosing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    pontoReferencia: "",
    enderecoPrincipal: false,
  });
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  const [product, setProduct] = useState<Global.Product | null>(null);
  const [seller, setSeller] = useState<Global.Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

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
      setLoading(false);
      setProduct(data);
      setSeller(data.users);
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    // Carregar endereços do localStorage
    const savedAddresses = localStorage.getItem("olx_addresses");
    if (savedAddresses) {
      const parsedAddresses = JSON.parse(savedAddresses);
      setAddresses(parsedAddresses);
      // Selecionar endereço principal se existir
      const mainAddress = parsedAddresses.find(
        (addr: Address) => addr.enderecoPrincipal
      );
      if (mainAddress) {
        setSelectedAddress(mainAddress);
      }
    }
  }, []);

  const closeAddressMenu = () => {
    setIsAddressMenuClosing(true);
    setTimeout(() => {
      setIsAddressMenuOpen(false);
      setIsAddressMenuClosing(false);
      // Limpar estados relacionados ao CEP
      setCepError("");
      setCepLoading(false);
    }, 300);
  };

  const formatCep = (value: string) => {
    // Remove todos os caracteres não numéricos
    const cleanValue = value.replace(/\D/g, "");

    // Limita a 8 dígitos
    const limitedValue = cleanValue.slice(0, 8);

    // Aplica a máscara 00000-000
    if (limitedValue.length > 5) {
      return `${limitedValue.slice(0, 5)}-${limitedValue.slice(5)}`;
    }

    return limitedValue;
  };

  const searchCep = async (cep: string) => {
    // Remove a máscara para fazer a busca
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    setCepLoading(true);
    setCepError("");

    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cep/v1/${cleanCep}`
      );

      if (!response.ok) {
        throw new Error("CEP não encontrado");
      }

      const data = await response.json();

      // Preenche automaticamente o campo de rua
      setAddressForm((prev) => ({
        ...prev,
        rua: data.street || "",
      }));
    } catch (error) {
      setCepError("CEP não encontrado");
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (value: string) => {
    const formattedCep = formatCep(value);
    setAddressForm({ ...addressForm, cep: formattedCep });

    // Limpa erros anteriores
    setCepError("");

    // Se o CEP estiver completo, faz a busca
    const cleanCep = formattedCep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      searchCep(formattedCep);
    }
  };

  const handleAddressSubmit = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      cep: addressForm.cep,
      rua: addressForm.rua,
      numero: addressForm.numero,
      complemento: addressForm.complemento,
      pontoReferencia: addressForm.pontoReferencia,
      enderecoPrincipal: addressForm.enderecoPrincipal,
    };

    let updatedAddresses = [...addresses];

    // Se for endereço principal, remover principal dos outros
    if (newAddress.enderecoPrincipal) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        enderecoPrincipal: false,
      }));
    }

    updatedAddresses.push(newAddress);
    setAddresses(updatedAddresses);
    localStorage.setItem("olx_addresses", JSON.stringify(updatedAddresses));

    // Selecionar o novo endereço
    setSelectedAddress(newAddress);

    // Limpar formulário e fechar menu
    setAddressForm({
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      pontoReferencia: "",
      enderecoPrincipal: false,
    });
    setCepError("");
    setCepLoading(false);
    closeAddressMenu();
  };

  if (loading || !product) return <Loading />;

  function formatName(fullName: string) {
    return fullName
      .split(" ")
      .map((part) => {
        if (part.length <= 1) return part;
        const firstLetter = part[0];
        const stars = "*".repeat(part.length - 1);
        return firstLetter + stars;
      })
      .join(" ");
  }

  function formatCPF(cpf: string) {
    const cleanCPF = cpf.replace(/\D/g, "");

    if (cleanCPF.length !== 11) return "CPF inválido";

    return `*** ${cleanCPF.slice(3, 6)} ${cleanCPF.slice(6, 9)} **`;
  }

  return (
    <>
      {/* Menu lateral de endereço */}
      {isAddressMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
              isAddressMenuClosing ? "bg-opacity-0" : "bg-opacity-30"
            }`}
            style={{
              animation: isAddressMenuClosing
                ? undefined
                : "fadeInOverlay 0.3s ease-out",
            }}
            onClick={closeAddressMenu}
          />
          <div
            className={`relative bg-white w-full max-w-md h-full mr-auto p-6 overflow-y-auto transform transition-all duration-300 ease-in-out shadow-2xl ${
              isAddressMenuClosing
                ? "-translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            }`}
            style={{
              animation: isAddressMenuClosing
                ? undefined
                : "slideInFromLeft 0.3s ease-out",
            }}
          >
            <div className="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3">
                <button
                  onClick={closeAddressMenu}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 12H5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 19L5 12L12 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h2 className="text-lg font-medium">Endereço</h2>
              </div>
              <button
                onClick={closeAddressMenu}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-between items-center mb-2">
                  <span></span>
                  <button
                    className="text-xs text-[#6e0ad6] font-medium hover:underline transition-all"
                    onClick={() =>
                      alert("Em breve você poderá buscar por cidade e bairro!")
                    }
                  >
                    Não sei meu cep
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={addressForm.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    className={`w-full px-3 py-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6e0ad6] focus:border-transparent ${
                      cepError ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {cepLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#6e0ad6] border-t-transparent"></div>
                    </div>
                  )}
                </div>
                {cepError && (
                  <p className="text-red-500 text-xs mt-1">{cepError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.rua}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, rua: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6e0ad6] focus:border-transparent"
                  placeholder=""
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.numero}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, numero: e.target.value })
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6e0ad6] focus:border-transparent"
                    placeholder=""
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={addressForm.complemento}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        complemento: e.target.value,
                      })
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6e0ad6] focus:border-transparent"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ponto de referência
                </label>
                <input
                  type="text"
                  value={addressForm.pontoReferencia}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      pontoReferencia: e.target.value,
                    })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6e0ad6] focus:border-transparent"
                  placeholder=""
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">
                  Endereço principal
                </span>
                <button
                  onClick={() =>
                    setAddressForm({
                      ...addressForm,
                      enderecoPrincipal: !addressForm.enderecoPrincipal,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    addressForm.enderecoPrincipal
                      ? "bg-[#6e0ad6]"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      addressForm.enderecoPrincipal
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddressSubmit}
              disabled={
                !addressForm.cep || !addressForm.rua || !addressForm.numero
              }
              className="w-full bg-[#f28000] text-white py-3 rounded-full font-medium mt-6 hover:bg-[#d45e00] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300"
            >
              Salvar endereço
            </button>
          </div>
        </div>
      )}

      <div className="w-full px-8 py-10">
        {/* Título */}
        <h2 className="text-2xl font-medium mb-6">Confirme sua compra</h2>

        {/* Entrega */}
        <div className="mb-7 mt-7">
          <h3 className="text-xl font-medium mb-6">Entrega</h3>
          <div
            className={`w-full border relative rounded-xl p-4 flex flex-col items-center gap-3 mt-3 cursor-pointer ${
              deliveryOption === "olx" ? "border-[#6e0ad6]" : "border-gray-200"
            }`}
            onClick={() => setDeliveryOption("olx")}
          >
            <div className="flex items-center gap-3 w-full">
              <Image
                src="/van-delivery.webp"
                alt="Delivery"
                width="80"
                height="80"
              />
              <div className="">
                <p className="font-medium text-[16px]">Entrega pela OLX</p>
                <p className="text-sm text-gray-500 max-w-[90%]">
                  {selectedAddress
                    ? `${selectedAddress.rua}, ${selectedAddress.numero}${
                        selectedAddress.complemento
                          ? `, ${selectedAddress.complemento}`
                          : ""
                      }`
                    : "Adicione seu endereço para calcular o frete"}
                </p>
              </div>
              <div
                className={`w-5 absolute top-4 right-4 h-5 rounded-full border flex items-center justify-center ${
                  deliveryOption === "olx"
                    ? "border-[#6e0ad6]"
                    : "border-gray-300"
                }`}
              >
                {deliveryOption === "olx" && (
                  <div className="w-3 h-3 bg-[#6e0ad6] rounded-full" />
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddressMenuOpen(true);
              }}
              className="text-sm text-[#6e0ad6] font-medium border-t border-gray-200 pt-3 w-full text-left hover:underline"
            >
              {addresses.length > 0 ? "Mudar endereço" : "Adicionar endereço"}
            </button>
          </div>
          <div
            className={`w-full border relative rounded-xl p-4 flex items-center gap-3 mt-3 cursor-pointer ${
              deliveryOption === "retirar"
                ? "border-[#6e0ad6]"
                : "border-gray-200"
            }`}
            onClick={() => setDeliveryOption("retirar")}
          >
            <Image
              src="/shake-hands.webp"
              alt="Delivery"
              width="80"
              height="80"
            />
            <div className="">
              <p className="font-medium text-[16px]">Retirar com vendedor</p>
              <p className="text-sm text-gray-500 max-w-[90%]">
                Combine diretamente com ele através do chat da OLX.
              </p>
            </div>
            <div
              className={`w-5 absolute top-4 right-4 h-5 rounded-full border flex items-center justify-center ${
                deliveryOption === "retirar"
                  ? "border-[#6e0ad6]"
                  : "border-gray-300"
              }`}
            >
              {deliveryOption === "retirar" && (
                <div className="w-3 h-3 bg-[#6e0ad6] rounded-full" />
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-2">Forma de pagamento</h3>

          {/* Cupom */}
          <div className="rounded-lg p-4 flex gap-3 mb-7 bg-[#f5f6f7]">
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
                d="M22.1219055,14.93875 L14.950625,22.110035 C14.4348123,22.6264219 13.7348754,22.9165733 13.005,22.9165733 C12.2751246,22.9165733 11.5751877,22.6264219 11.0599789,22.1106389 L2.46997887,13.5306389 C2.3291376,13.3899616 2.25,13.1990637 2.25,13 L2.25,3 C2.25,2.58578644 2.58578644,2.25 3,2.25 L13,2.25 C13.1989124,2.25 13.3896778,2.32901763 13.5303301,2.46966991 L22.1219055,11.06125 C23.1881454,12.133853 23.1881454,13.866147 22.1219055,14.93875 Z M3.75,12.6890839 L12.120625,21.049965 C12.3550853,21.2846863 12.6732384,21.4165733 13.005,21.4165733 C13.3367616,21.4165733 13.6549147,21.2846863 13.8896699,21.0496699 L21.0596699,13.8796699 C21.542749,13.3937032 21.542749,12.6062968 21.0596699,12.1203301 L12.6893398,3.75 L3.75,3.75 L3.75,12.6890839 Z M8,9 C7.44771525,9 7,8.55228475 7,8 C7,7.44771525 7.44771525,7 8,7 C8.55228475,7 9,7.44771525 9,8 C9,8.55228475 8.55228475,9 8,9 Z"
              ></path>
            </svg>
            <div className="flex-1">
              <p className="font-medium text-[16px]">Cupom de desconto</p>
              <a
                href="#"
                className="text-[#6e0ad6] underline font-medium hover:underline"
              >
                Adicionar
              </a>
            </div>
          </div>

          <div
            className={`w-full border rounded-lg p-4 flex items-center gap-3 relative cursor-pointer ${
              paymentMethod === "pix" ? "border-[#6e0ad6]" : "border-gray-200"
            }`}
            onClick={() => setPaymentMethod("pix")}
          >
            <div className="w-5 h-5 rounded-full border flex items-center justify-center border-[#6e0ad6]">
              <div className="w-3 h-3 bg-[#6e0ad6] rounded-full" />
            </div>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              data-origin="svg-preserve-color"
            >
              <path
                d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
                fill="#32BCAD"
              ></path>
              <path
                fillRule="evenodd"
                clip-rule="evenodd"
                d="M11.7193 11.751C12.347 11.751 12.9372 11.9955 13.3811 12.4391L15.7896 14.8481C15.9631 15.0215 16.2462 15.0222 16.4202 14.8478L18.8199 12.4479C19.2638 12.0043 19.8541 11.7598 20.4819 11.7598H20.7709L17.7229 8.71192C16.7737 7.76269 15.2348 7.76269 14.2856 8.71192L11.2465 11.751H11.7193ZM20.482 20.2402C19.8542 20.2402 19.2639 19.9957 18.82 19.552L16.4204 17.1524C16.2519 16.9834 15.9583 16.9839 15.7898 17.1524L13.3813 19.5608C12.9374 20.0045 12.3471 20.2488 11.7194 20.2488H11.2465L14.2857 23.2882C15.2349 24.2373 16.7739 24.2373 17.723 23.2882L20.771 20.2402H20.482ZM21.4453 12.4403L23.2871 14.2822C24.2364 15.2313 24.2364 16.7703 23.2871 17.7195L21.4453 19.5613C21.4047 19.5451 21.3609 19.535 21.3145 19.535H20.4771C20.0441 19.535 19.6203 19.3595 19.3144 19.0532L16.9148 16.6538C16.4798 16.2184 15.7211 16.2185 15.2857 16.6535L12.8772 19.0621C12.5712 19.3681 12.1474 19.5437 11.7145 19.5437H10.6847C10.6409 19.5437 10.5997 19.5541 10.561 19.5687L8.7118 17.7195C7.76257 16.7703 7.76257 15.2313 8.7118 14.2822L10.5611 12.4329C10.5998 12.4475 10.6409 12.458 10.6847 12.458H11.7145C12.1474 12.458 12.5712 12.6335 12.8772 12.9396L15.2859 15.3483C15.5104 15.5726 15.8052 15.685 16.1003 15.685C16.3951 15.685 16.6902 15.5726 16.9146 15.3481L19.3144 12.9484C19.6203 12.6422 20.0441 12.4666 20.4771 12.4666H21.3145C21.3608 12.4666 21.4047 12.4566 21.4453 12.4403Z"
                fill="white"
              ></path>
            </svg>
            <div className="flex-1">
              <p className="font-medium text-sm">Pix</p>
              <p className="text-xs text-gray-500">
                A confirmação do seu pagamento é mais rápida
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-8 pb-9">
        <h2 className="text-xl font-medium mb-6">Resumo</h2>

        {/* Produto */}
        <div className="flex items-center gap-4">
          <Image
            src={product.images?.[0] || "/fallback.jpg"}
            alt={product.title}
            width={600}
            height={600}
            className="rounded-md object-cover w-[72px] h-[72px]"
          />

          <div>
            <p className="font-medium text-[16px] leading-5">{product.title}</p>
          </div>
        </div>
        <hr className="my-4 border-[#cfd4dd]" />
        {/* Vendedor */}
        <div className="flex justify-between items-center mt-4 ">
          <div className="text-[14px] text-[#4f4f4fb9]">
            <p>Vendedor: {formatName(seller?.name ?? "")}</p>
            <p>CPF: {formatCPF(seller?.cpf ?? "")}</p>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Image src="/user.png" alt="" width={50} height={50} />
          </div>
        </div>
        <hr className="my-4 border-[#cfd4dd]" />
        {/* Total */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-[17px] font-semibold">Total a pagar</p>
          <p className="text-[17px] font-semibold">
            {(product.price + 10).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>

        {/* Botão */}
        <a
          href={`/pedido/${product.slug}`}
          className="min-w-full flex justify-center bg-[#f28000] font-medium text-white rounded-full py-[21px] mt-4 hover:bg-[#d45e00] transition text-[15px]"
        >
          Confirmar pagamento
        </a>

        {/* Detalhes */}
        <div className="mt-5">
          <div className="flex justify-between text-[13px]">
            <p className="text-[#4f4f4f]">Valor do Produto</p>
            <p className="font-semibold">
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="flex justify-between text-[13px] mt-1">
            <p className="text-[#4f4f4f]">Frete</p>
            <p className="font-semibold">R$ 10,00</p>
          </div>
        </div>

        {/* Info garantia */}
        <div className="flex items-start gap-4 rounded-xl p-4 mt-4 bg-[#f5f6f7]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="scale-110"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M12,22.75 C6.06293894,22.75 1.25,17.9370611 1.25,12 C1.25,6.06293894 6.06293894,1.25 12,1.25 C17.9370611,1.25 22.75,6.06293894 22.75,12 C22.75,17.9370611 17.9370611,22.75 12,22.75 Z M12,21.25 C17.1086339,21.25 21.25,17.1086339 21.25,12 C21.25,6.89136606 17.1086339,2.75 12,2.75 C6.89136606,2.75 2.75,6.89136606 2.75,12 C2.75,17.1086339 6.89136606,21.25 12,21.25 Z M12.75,16 C12.75,16.4142136 12.4142136,16.75 12,16.75 C11.5857864,16.75 11.25,16.4142136 11.25,16 L11.25,12 C11.25,11.5857864 11.5857864,11.25 12,11.25 C12.4142136,11.25 12.75,11.5857864 12.75,12 L12.75,16 Z M12,10 C11.4477153,10 11,9.55228475 11,9 C11,8.44771525 11.4477153,8 12,8 C12.5522847,8 13,8.44771525 13,9 C13,9.55228475 12.5522847,10 12,10 Z"
            ></path>
          </svg>
          <p className="text-[14px] text-[#4f4f4f] leading-5">
            A garantia da OLX é cobrada para garantir seu reembolso em caso de
            problemas.
          </p>
        </div>

        {/* Termos */}
        <p className="text-[12px] text-[#4f4f4f] mt-3 leading-4">
          Ao confirmar o pagamento, você declara que está concordando com os{" "}
          <span className="text-[#6e0ad6] font-medium cursor-pointer hover:underline">
            Termos e Condições
          </span>{" "}
          de uso da Garantia da OLX.
        </p>
      </div>
    </>
  );
}
