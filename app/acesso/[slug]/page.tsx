"use client";

import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineInfoCircle, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../contexts/user.context";

export default function Register() {
  const { slug } = useParams();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const router = useRouter();
  const { setUser } = useUser();

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const fakeUser = {
      id: "1",
      name: "Usuário Teste",
      email: email,
    };
    setUser(fakeUser);

    localStorage.setItem("user-olx", JSON.stringify(fakeUser));

    router.push(`/pagamento/${slug}`);
  }
  return (
    <div className="pt-16 flex justify-center items-center min-h-screen bg-white text-black">
      <div className="w-full max-w-[450px] border border-gray-200 rounded-xl p-8">
        {/* Logo */}
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            data-ds-component="DS-LogoOLX"
            viewBox="0 0 40 40"
            className="w-[66px] h-[66px]"
          >
            <g fill="none" fillRule="evenodd">
              <path
                fill="#6e0ad6" // Azul
                d="M7.579 26.294c-2.282 0-3.855-1.89-3.855-4.683 0-2.82 1.573-4.709 3.855-4.709 2.28 0 3.855 1.889 3.855 4.682 0 2.82-1.574 4.71-3.855 4.71m0 3.538c4.222 0 7.578-3.512 7.578-8.248 0-4.682-3.173-8.22-7.578-8.22C3.357 13.363 0 16.874 0 21.61c0 4.763 3.173 8.221 7.579 8.221"
              />
              <path
                fill="#8ce563" // Laranja
                d="M18.278 23.553h7.237c.499 0 .787-.292.787-.798V20.44c0-.505-.288-.798-.787-.798h-4.851V9.798c0-.505-.288-.798-.787-.798h-2.386c-.498 0-.787.293-.787.798v12.159c0 1.038.551 1.596 1.574 1.596"
              />
              <path
                fill="#f28000" // Roxo
                d="M28.112 29.593l4.353-5.082 4.222 5.082c.367.452.839.452 1.258.08l1.705-1.517c.42-.373.472-.851.079-1.277l-4.694-5.321 4.274-4.869c.367-.426.34-.878-.078-1.277l-1.6-1.463c-.42-.4-.892-.373-1.259.08l-3.907 4.602-3.986-4.603c-.367-.425-.84-.479-1.259-.08l-1.652 1.49c-.42.4-.446.825-.053 1.278l4.354 4.868-4.747 5.348c-.393.452-.34.905.079 1.277l1.652 1.464c.42.372.891.345 1.259-.08"
              />
            </g>
          </svg>
        </div>

        <h2 className="text-center text-2xl font-semibold mb-4">
          Crie a sua conta. É grátis!
        </h2>

        <div className="flex items-center justify-center gap-8">
          <button className="border border-gray-300 rounded-full p-3 hover:bg-gray-50">
            <FcGoogle className="w-8 h-8" />
          </button>
          <button className="bg-[#3b5998] w-[56px] h-[56px] flex justify-center items-center rounded-full p-3 hover:opacity-90">
            <FaFacebookF className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex items-center w-full mt-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-sm text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <p className="text-center text-gray-600 mb-6 mt-3">
          Nos informe alguns dados para que possamos melhorar a sua experiência
          na OLX.
        </p>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="flex items-center gap-1 text-sm font-extrabold mb-1">
              CPF
              <AiOutlineInfoCircle className="w-4 h-4 text-gray-500" />
            </label>
            <input
              type="text"
              placeholder="000.000.000-00"
              className="w-full h-[46px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Nome completo */}
          <div>
            <label className="block text-md mb-1 font-extrabold">
              Nome completo
            </label>
            <input
              type="text"
              className="w-full h-[46px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Apelido */}
          <div>
            <label className="block text-md mb-1 font-extrabold">
              Como você quer ser chamado(a)?
            </label>
            <input
              type="text"
              placeholder="Exemplo: João S."
              className="w-full h-[46px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Aparecerá em seu perfil, anúncios e chats.
            </p>
          </div>

          {/* Data de nascimento */}
          <div>
            <label className="block text-md mb-1 font-extrabold">
              Data de nascimento
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd/mm/aaaa"
                className="w-full h-[46px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <BsCalendarDate className="absolute right-3 top-3.5 text-gray-500" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-md mb-1 font-extrabold">E-mail</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[46px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-md mb-1 font-extrabold">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-[46px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <AiOutlineEyeInvisible
                className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <p className="text-[12px] mt-4 font-extrabold">
              Para sua segurança, crie uma senha com no mínimo:
            </p>
            <ul className="text-[11px] text-gray-600 space-y-2 mt-3">
              <li className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M13.0606602,12 L18.5303301,17.4696699 C18.8232233,17.7625631 18.8232233,18.2374369 18.5303301,18.5303301 C18.2374369,18.8232233 17.7625631,18.8232233 17.4696699,18.5303301 L12,13.0606602 L6.53033009,18.5303301 C6.23743687,18.8232233 5.76256313,18.8232233 5.46966991,18.5303301 C5.1767767,18.2374369 5.1767767,17.7625631 5.46966991,17.4696699 L10.9393398,12 L5.46966991,6.53033009 C5.1767767,6.23743687 5.1767767,5.76256313 5.46966991,5.46966991 C5.76256313,5.1767767 6.23743687,5.1767767 6.53033009,5.46966991 L12,10.9393398 L17.4696699,5.46966991 C17.7625631,5.1767767 18.2374369,5.1767767 18.5303301,5.46966991 C18.8232233,5.76256313 18.8232233,6.23743687 18.5303301,6.53033009 L13.0606602,12 L13.0606602,12 Z"
                  ></path>
                </svg>{" "}
                8 ou mais caracteres
              </li>
              <li className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M13.0606602,12 L18.5303301,17.4696699 C18.8232233,17.7625631 18.8232233,18.2374369 18.5303301,18.5303301 C18.2374369,18.8232233 17.7625631,18.8232233 17.4696699,18.5303301 L12,13.0606602 L6.53033009,18.5303301 C6.23743687,18.8232233 5.76256313,18.8232233 5.46966991,18.5303301 C5.1767767,18.2374369 5.1767767,17.7625631 5.46966991,17.4696699 L10.9393398,12 L5.46966991,6.53033009 C5.1767767,6.23743687 5.1767767,5.76256313 5.46966991,5.46966991 C5.76256313,5.1767767 6.23743687,5.1767767 6.53033009,5.46966991 L12,10.9393398 L17.4696699,5.46966991 C17.7625631,5.1767767 18.2374369,5.1767767 18.5303301,5.46966991 C18.8232233,5.76256313 18.8232233,6.23743687 18.5303301,6.53033009 L13.0606602,12 L13.0606602,12 Z"
                  ></path>
                </svg>{" "}
                Uma letra maiúscula
              </li>
              <li className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M13.0606602,12 L18.5303301,17.4696699 C18.8232233,17.7625631 18.8232233,18.2374369 18.5303301,18.5303301 C18.2374369,18.8232233 17.7625631,18.8232233 17.4696699,18.5303301 L12,13.0606602 L6.53033009,18.5303301 C6.23743687,18.8232233 5.76256313,18.8232233 5.46966991,18.5303301 C5.1767767,18.2374369 5.1767767,17.7625631 5.46966991,17.4696699 L10.9393398,12 L5.46966991,6.53033009 C5.1767767,6.23743687 5.1767767,5.76256313 5.46966991,5.46966991 C5.76256313,5.1767767 6.23743687,5.1767767 6.53033009,5.46966991 L12,10.9393398 L17.4696699,5.46966991 C17.7625631,5.1767767 18.2374369,5.1767767 18.5303301,5.46966991 C18.8232233,5.76256313 18.8232233,6.23743687 18.5303301,6.53033009 L13.0606602,12 L13.0606602,12 Z"
                  ></path>
                </svg>{" "}
                Uma letra minúscula
              </li>
              <li className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M13.0606602,12 L18.5303301,17.4696699 C18.8232233,17.7625631 18.8232233,18.2374369 18.5303301,18.5303301 C18.2374369,18.8232233 17.7625631,18.8232233 17.4696699,18.5303301 L12,13.0606602 L6.53033009,18.5303301 C6.23743687,18.8232233 5.76256313,18.8232233 5.46966991,18.5303301 C5.1767767,18.2374369 5.1767767,17.7625631 5.46966991,17.4696699 L10.9393398,12 L5.46966991,6.53033009 C5.1767767,6.23743687 5.1767767,5.76256313 5.46966991,5.46966991 C5.76256313,5.1767767 6.23743687,5.1767767 6.53033009,5.46966991 L12,10.9393398 L17.4696699,5.46966991 C17.7625631,5.1767767 18.2374369,5.1767767 18.5303301,5.46966991 C18.8232233,5.76256313 18.8232233,6.23743687 18.5303301,6.53033009 L13.0606602,12 L13.0606602,12 Z"
                  ></path>
                </svg>{" "}
                Um número
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-2 mt-6">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="terms" className="text-xs text-gray-600">
              Aceito receber e-mails promocionais da OLX. Não se preocupe, você
              pode cancelar a qualquer momento.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg mt-6"
          >
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <a
            href={`/acesso/${slug}`}
            className="text-purple-600 font-medium hover:underline"
          >
            Faça o login
          </a>
        </p>

        <p className="mt-4 text-xs text-center text-gray-500">
          Ao continuar, você concorda com os{" "}
          <a href="/termos-de-uso" className="text-purple-600 hover:underline">
            Termos de Uso
          </a>{" "}
          e a{" "}
          <a
            href="/politica-de-privacidade"
            className="text-purple-600 hover:underline"
          >
            Política de Privacidade
          </a>{" "}
          da OLX e seus parceiros.
        </p>
      </div>
    </div>
  );
}
