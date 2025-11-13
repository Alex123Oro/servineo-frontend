"use client";

import React, { useEffect, useState } from "react";
import { Mail, Github, LucideIcon } from "lucide-react";
import {
  obtenerMetodosCliente,
  desvincularMetodo,
  AuthProvider,
} from "../service/api";
import VincularCorreo from "../vinculos/vincularCorreo";
import VincularGoogle from "../vinculos/vincularGoogle";
import VincularGithub from "../vinculos/vincularGithub";

interface Props {
  token?: string;
}

const ALL_PROVIDERS_META = [
  { provider: "google", name: "Google" },
  { provider: "github", name: "GitHub" },
  { provider: "email", name: "Correo Electrónico" },
] as const;

const iconMap: Partial<Record<AuthProvider["provider"], LucideIcon>> = {
  github: Github,
  email: Mail,
};

interface FullAuthProvider extends AuthProvider {
  isLinked: boolean;
  name: string;
}

export default function Page({ token = "" }: Props) {
  const [methods, setMethods] = useState<FullAuthProvider[]>([]);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const buildFullMethodsList = (
    linkedMethodsFromAPI: AuthProvider[]
  ): FullAuthProvider[] => {
    const linkedMethodsMap = new Map<string, AuthProvider>(
      linkedMethodsFromAPI.map((m) => [m.provider, m])
    );

    return ALL_PROVIDERS_META.map((p) => {
      const linkedData = linkedMethodsMap.get(p.provider);
      return {
        provider: p.provider,
        name: p.name,
        isLinked: !!linkedData,
        email: linkedData?.email,
        token: linkedData?.token,
      };
    });
  };

  useEffect(() => {
    async function fetchMethods() {
      try {
        const linkedMethodsFromAPI = await obtenerMetodosCliente();
        const fullList = buildFullMethodsList(linkedMethodsFromAPI);
        setMethods(fullList);
      } catch (err) {
        console.error("Error al cargar métodos:", err);
      }
    }
    fetchMethods();
  }, [token]);

  const linkedMethods = methods.filter((m) => m.isLinked);
  const availableMethods = methods.filter((m) => !m.isLinked);

  const handleLink = async (provider: string) => {
    try {
      const updatedLinkedMethods = await obtenerMetodosCliente();
      const fullList = buildFullMethodsList(updatedLinkedMethods);
      setMethods(fullList);
    } catch (err) {
      console.error(err);
      alert(
        `Error al vincular el método ${provider}: ${
          err instanceof Error ? err.message : "Desconocido"
        }`
      );
    }
  };

  const handleUnlink = async (provider: string) => {
    if (linkedMethods.length <= 1) {
      alert("Debes tener al menos un método activo.");
      return;
    }
    if (window.confirm(`¿Desvincular ${provider}?`)) {
      try {
        const updatedLinkedMethods = await desvincularMetodo(provider);
        const fullList = buildFullMethodsList(updatedLinkedMethods);
        setMethods(fullList);
      } catch (err) {
        console.error(err);
        alert(
          `Error al desvincular método ${provider}: ${
            err instanceof Error ? err.message : "Desconocido"
          }`
        );
      }
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Configuración de Cuentas Vinculadas
        </h1>

        {/* Métodos vinculados */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Cuentas Vinculadas ({linkedMethods.length})
          </h2>
          <div className="space-y-3">
            {linkedMethods.map((method) => {
              const Icon = iconMap[method.provider] as LucideIcon;
              return (
                <div
                  key={method.provider}
                  className="flex justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg text-blue-700">
                      {method.provider === "google" ? (
                        <img
                          src="https://www.svgrepo.com/show/475656/google-color.svg"
                          alt="Google"
                          className="w-5 h-5"
                        />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 flex items-center gap-2">
                        {method.name}
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Activo
                        </span>
                      </p>
                      {method.email && (
                        <p className="text-gray-500 text-sm">{method.email}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnlink(method.provider)}
                    disabled={linkedMethods.length <= 1}
                    className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-200 ${
                      linkedMethods.length <= 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    Desvincular
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Métodos disponibles */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Métodos Disponibles ({availableMethods.length})
          </h2>

          {availableMethods.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              Todos los métodos están actualmente vinculados.
            </p>
          ) : (
            <div className="space-y-3">
              {availableMethods.map((method) => {
                if (method.provider === "google") {
                  return (
                    <VincularGoogle
                      key="google"
                      tokenUsuario={token}
                      onLinked={() => handleLink("google")}
                    />
                  );
                }
                if (method.provider === "github") {
                  return (
                    <VincularGithub
                      key="github"
                      onLinked={() => handleLink("github")}
                    />
                  );
                }

                const Icon = iconMap[method.provider] as LucideIcon;
                return (
                  <div
                    key={method.provider}
                    className="flex justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg text-gray-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {method.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Vincula tu cuenta para un acceso rápido.
                        </p>
                      </div>
                    </div>

                    {method.provider === "email" && (
                      <button
                        onClick={() => setShowEmailForm(!showEmailForm)}
                        className="text-sm font-medium px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                      >
                        {showEmailForm ? "Cancelar" : "Vincular"}
                      </button>
                    )}
                  </div>
                );
              })}

              {showEmailForm && (
                <div className="mt-3">
                  <VincularCorreo
                    token={token}
                    onLinked={(client) => {
                      const fullList = buildFullMethodsList(
                        client.authProviders
                      );
                      setMethods(fullList);
                      setShowEmailForm(false);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
