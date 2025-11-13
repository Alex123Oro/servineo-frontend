import ClientVerify from './ClienteVerify';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // 👇 En Next 15, searchParams es Promise
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-servineo-500 via-servineo-300 to-servineo-400 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-sm w-full">
        <h1 className="text-xl font-semibold text-servineo-500 mb-4">
          Verificación
        </h1>
        {/* Lógica de navegador en el componente cliente */}
        <ClientVerify token={token} />
      </div>
    </main>
  );
}
