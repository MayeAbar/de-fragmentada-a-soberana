import { NavLink, Link } from 'react-router-dom';
import { Bookmark, Crown } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Diario' },
  { to: '/manifiesto', label: 'Acerca de Mí' },
  { to: '/el-sistema', label: 'El Sistema' },
  { to: '/el-programa', label: 'El Programa' },
  { to: '/libro', label: 'El Libro' },
  { to: '/buzon', label: 'Buzón' },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="glass-linen-strong">
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="grid place-items-center w-8 h-8 rounded-full border border-gold/40">
              <Crown className="w-4 h-4 text-gold" strokeWidth={1.5} />
            </span>
            <span className="font-serif text-[15px] font-medium tracking-tight text-[#3D3833] hidden sm:block">
              De Fragmentada <span className="italic text-gold">a</span> Soberana
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-6">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `text-[13px] font-medium tracking-wide transition-colors ${
                      isActive
                        ? 'text-gold'
                        : 'text-[#5C544D] hover:text-[#3D3833]'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link
            to="/?fav=true"
            className="grid place-items-center w-9 h-9 rounded-full border border-nude hover:border-gold/50 transition-colors group shrink-0"
            aria-label="Favoritos"
          >
            <Bookmark className="w-4 h-4 text-[#5C544D] group-hover:text-gold transition-colors" strokeWidth={1.5} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
