"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../../contexts/user.context";

export default function Login() {
  const { slug } = useParams();

  const router = useRouter();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const fakeUser = { id: "1", name: "", email: email };
    setUser(fakeUser);
    localStorage.setItem("user-olx", JSON.stringify(fakeUser));
    router.push(`/pagamento/${slug}`);
  }

  return (
    <div className="bg-white">
      <header className="px-4 h-[80px] text-2xl flex w-full justify-between items-center bg-white border-b border-black/15">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          data-ds-component="DS-LogoOLX"
          viewBox="0 0 40 40"
          className="w-12 h-12"
        >
          <g fill="none" fillRule="evenodd">
            <path
              fill="#6e0ad6"
              d="M7.579 26.294c-2.282 0-3.855-1.89-3.855-4.683 0-2.82 1.573-4.709 3.855-4.709 2.28 0 3.855 1.889 3.855 4.682 0 2.82-1.574 4.71-3.855 4.71m0 3.538c4.222 0 7.578-3.512 7.578-8.248 0-4.682-3.173-8.22-7.578-8.22C3.357 13.363 0 16.874 0 21.61c0 4.763 3.173 8.221 7.579 8.221"
            />
            <path
              fill="#8ce563"
              d="M18.278 23.553h7.237c.499 0 .787-.292.787-.798V20.44c0-.505-.288-.798-.787-.798h-4.851V9.798c0-.505-.288-.798-.787-.798h-2.386c-.498 0-.787.293-.787.798v12.159c0 1.038.551 1.596 1.574 1.596"
            />
            <path
              fill="#f28000"
              d="M28.112 29.593l4.353-5.082 4.222 5.082c.367.452.839.452 1.258.08l1.705-1.517c.42-.373.472-.851.079-1.277l-4.694-5.321 4.274-4.869c.367-.426.34-.878-.078-1.277l-1.6-1.463c-.42-.4-.892-.373-1.259.08l-3.907 4.602-3.986-4.603c-.367-.425-.84-.479-1.259-.08l-1.652 1.49c-.42.4-.446.825-.053 1.278l4.354 4.868-4.747 5.348c-.393.452-.34.905.079 1.277l1.652 1.464c.42.372.891.345 1.259-.08"
            />
          </g>
        </svg>
      </header>

      <div className="min-h-[100vh] bg-white flex justify-center mt-12 text-black">
        <div className="block bg-white px-2 max-w-[466px] relative">
          <div className="w-full rounded-[8px] border p-6 pb-0 border-black/15 flex flex-col justify-center items-center relative">
            <h2 className="text-center text-[20px] font-semibold mb-6 text-black">
              Acesse a sua conta
            </h2>

            <form
              onSubmit={handleLogin}
              className="space-y-4 w-full max-w-[352px] mt-14"
            >
              <div>
                <label className="text-[16px] font-semibold">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[46px] rounded-lg border border-black/15 mt-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-[16px] font-semibold">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[46px] rounded-lg border border-black/15 mt-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="w-full h-[40px] rounded-full bg-[#f28000] hover:bg-[#df7400] text-white font-medium py-2 transition mt-5"
              >
                Continuar
              </button>
            </form>

            <div className="flex items-center w-full mt-12 m-7">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-3 text-sm text-gray-400">Ou conecte com</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex items-center justify-center gap-6">
              <button className="border border-gray-300 rounded-full p-3 hover:bg-gray-50">
                <FcGoogle className="w-8 h-8" />
              </button>
              <button className="bg-[#3b5998] w-[56px] h-[56px] flex justify-center items-center rounded-full p-3 hover:opacity-90">
                <FaFacebookF className="w-6 h-6 text-white" />
              </button>
            </div>

            <p className="mt-5 text-center text-sm mb-4">
              Não tem uma conta?{" "}
              <a
                href={`/cadastro/${slug}`}
                className="text-[#6e0ad6] font-medium hover:underline"
              >
                Cadastre-se
              </a>
            </p>

            <div className="mt-5 w-[448px] bg-gray-50 text-sm text-center py-2 rounded-[8px]">
              <a
                href="/ajuda"
                className="text-black flex justify-center items-center"
              >
                Preciso de ajuda{" "}
                <svg
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  className="ml-1"
                >
                  <path
                    fill="#4A4A4A"
                    d="M8.47 17.47c-.29.29-.29.76 0 1.06.29.29.76.29 1.06 0l6-6c.29-.29.29-.76 0-1.06l-6-6c-.29-.29-.76-.29-1.06 0-.29.29-.29.76 0 1.06L13.94 12l-5.47 5.47z"
                  ></path>
                </svg>
              </a>
            </div>

            <p className="mt-4 text-xs text-center text-gray-500 absolute -bottom-10">
              Ao continuar, você concorda com os{" "}
              <a
                href="/termos-de-uso"
                className="text-[#6e0ad6] hover:underline"
              >
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a
                href="/politica-de-privacidade"
                className="text-[#6e0ad6] hover:underline"
              >
                Política de Privacidade
              </a>{" "}
              da OLX e seus parceiros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
