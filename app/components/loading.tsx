import { FaSpinner } from "react-icons/fa";

export default function Loading({ text }: { text?: string }) {
  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center">
      <div className="flex justify-center items-center flex-col">
        <FaSpinner className="w-8 h-8 animate-spin text-[#6e0ad6]" />
        {text && <p className="font-extrabold mt-4">{text}</p>}
      </div>
    </div>
  );
}
