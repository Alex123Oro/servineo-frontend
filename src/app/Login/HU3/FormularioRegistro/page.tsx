'use client';
import Link from "next/link";
import RegistroGoogle from "../components/registro/registroGoogle";
import RegistroForm from "../../HU1/RequesterForm/page";

export default function SignUp() {
  return (
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-10 border border-servineo-100 hover:shadow-servineo-300 transition-shadow duration-300">
      <h1 className="text-3xl font-bold text-center text-black mb-2">
        Regístrate <span className="text-servineo-500">Servineo</span>
      </h1>
      <p className="text-center text-sm text-gray-700 mb-8">Crea tu cuenta como requester</p>  
      <RegistroForm />
      <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-2 text-gray-400 text-sm">o</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <RegistroGoogle />
      <div className="flex items-center mt-5 text-sm text-gray-600">
          <input type="checkbox" className="mr-2" />
          <p>
            Al registrarte aceptas los{" "}
            <Link
              href="/Login/HU1/RequesterForm/Terminosycondiciones"
              className="underline cursor-pointer text-[#2BDDE0]"
            >
              términos de uso
            </Link>{" "}
          </p>
        </div>
         <p className="mt-1 text-center text-sm text-gray-700">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/Login/HU4/login"
          prefetch={false}
          className="text-servineo-400 hover:text-servineo-500 font-medium hover:underline transition"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
