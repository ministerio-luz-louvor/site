import Link from 'next/link';

export const metadata = {
  title: 'Configurações',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white max-w-6xl m-auto">
      <aside className="w-56 border-r border-gray-100 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold mb-3">Configurações</h3>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/settings/home" className="text-sm text-gray-700 hover:text-brand-navy">Configurações da Home</Link>
            </li>
            <li>
              <Link href="/settings/albums" className="text-sm text-gray-700 hover:text-brand-navy">Álbuns</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
