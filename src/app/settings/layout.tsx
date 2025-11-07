import Link from 'next/link';

export const metadata = {
  title: 'Configurações',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, borderRight: '1px solid #e5e7eb', padding: 16, background: '#fafafa' }}>
        <h3 style={{ marginTop: 0 }}>Configurações</h3>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8 }}>
              <Link href="/settings/home">Configurações da Home</Link>
            </li>
            <li>
              <Link href="/settings/albums">Álbuns</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}
