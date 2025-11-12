// app/controlC/HU9/enlace-enviado/page.tsx
import ClientView from './ClientVerify';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const email = typeof sp.email === 'string' ? sp.email : undefined;
  const token = typeof sp.token === 'string' ? sp.token : undefined;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-servineo-500 via-servineo-300 to-servineo-400 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-0 overflow-hidden border border-servineo-100">
        <div className="bg-gradient-to-r from-servineo-500 to-servineo-300 p-6">
          <div className="flex items-center gap-3 text-white">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 ring-1 ring-white/30">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <div>
              <h1 className="text-xl font-semibold leading-6">¡Enlace enviado!</h1>
              <p className="text-white/90 text-sm">
                {email
                  ? <>Revisa <span className="font-medium">{maskEmail(email)}</span> para continuar.</>
                  : 'Revisa tu correo registrado para continuar.'}
              </p>
            </div>
          </div>
        </div>

        {/* Lógica de navegador (cooldown, timers, fetch) en el Client Component */}
        <ClientView email={email} token={token} />
      </div>
    </main>
  );
}

function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  if (user.length <= 2) return user[0] + '***@' + domain;
  return user.slice(0, 2) + '*****@' + domain;
}
