import { FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-center items-center bg-white text-gray-800">
      <FaSearch className="w-12 h-12 text-gray-500 animate-pulse" />
      <h1 className="text-4xl font-bold mt-4">404</h1>
      <p className="text-lg mt-2">Página não encontrada</p>
      <p className="text-sm text-gray-500 mt-1">
        A página que você tentou acessar não existe ou foi removida.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm transition"
      >
        Voltar para o início
      </a>
    </div>
  );
}
