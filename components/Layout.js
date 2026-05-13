import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/sales', label: 'Sales Register', icon: '🛒' },
  { href: '/inwards', label: 'Inwards Register', icon: '📦' },
  { href: '/expenses', label: 'Expenses', icon: '💸' },
  { href: '/returns', label: 'Returns', icon: '↩️' },
  { href: '/inventory', label: 'Inventory', icon: '🏪' },
  { href: '/prices', label: 'Price Master', icon: '🏷️' },
];

export default function Layout({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile overlay */}
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 40 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#0f1e35', borderRight: '1px solid #1e3a5f',
        display: 'flex', flexDirection: 'column', padding: '1rem 0.75rem',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
      }}
        className="sidebar">
        <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#0e7c6a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Trading App</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', fontFamily: 'Georgia, serif' }}>Mama Mia Souk</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.6rem 0.75rem', borderRadius: 8,
                color: router.pathname === item.href ? '#16c4ab' : '#94a3b8',
                background: router.pathname === item.href ? '#0e7c6a20' : 'transparent',
                fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.2s',
              }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ fontSize: '0.65rem', color: '#475569', padding: '0 0.5rem', marginTop: '1rem' }}>
          Mama Mia Souk © 2026
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{
          background: '#0f1e35', borderBottom: '1px solid #1e3a5f',
          padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center',
          gap: 12, position: 'sticky', top: 0, zIndex: 30,
        }}>
          <button onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.3rem', cursor: 'pointer' }}>
            ☰
          </button>
          <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600 }}>
            {navItems.find(n => n.href === router.pathname)?.label || 'Mama Mia Souk'}
          </span>
        </header>

        <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          .sidebar { transform: translateX(0) !important; }
          main { margin-left: 220px; }
          header { margin-left: 220px; }
        }
      `}</style>
    </div>
  );
}
