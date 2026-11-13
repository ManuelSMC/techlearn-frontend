import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, Mail, Menu, Phone, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const NAV_LINKS = [
  { href: '/#cursos', label: 'Cursos' },
  { href: '/#categorias', label: 'Categorías' },
  { to: '/instructores', label: 'Instructores' },
];

// Cada rol tiene su propia sección privada.
const PANEL_BY_ROLE = {
  user: { to: '/mis-cursos', label: 'Mis cursos' },
  instructor: { to: '/instructor', label: 'Mi panel' },
  admin: { to: '/admin', label: 'Administración' },
};

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const panel = user ? PANEL_BY_ROLE[user.role] : null;

  return (
    <header className="header">
      <div className="header__topbar">
        <div className="container header__topbar-inner">
          <p className="header__tagline">Aprende tecnología a tu ritmo</p>
          <ul className="header__contact">
            <li>
              <a className="header__contact-link" href="mailto:contacto@techlearn.com" aria-label="Correo">
                <Mail size={16} />
              </a>
            </li>
            <li>
              <a className="header__contact-link" href="tel:+520000000000" aria-label="Teléfono">
                <Phone size={16} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container header__main">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <GraduationCap size={28} aria-hidden="true" />
          TechLearn
        </Link>

        <button
          type="button"
          className="header__toggle"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        <nav id="main-nav" className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`} aria-label="Principal">
          <ul className="header__links">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                {link.to ? (
                  <NavLink className="header__link" to={link.to} onClick={closeMenu}>
                    {link.label}
                  </NavLink>
                ) : (
                  <a className="header__link" href={link.href} onClick={closeMenu}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            {panel && (
              <li>
                <NavLink className="header__link" to={panel.to} onClick={closeMenu}>
                  {panel.label}
                </NavLink>
              </li>
            )}
          </ul>

          {user ? (
            <div className="header__session">
              <span className="header__user">Hola, {user.name.split(' ')[0]}</span>
              <button type="button" className="button button--outline button--small" onClick={handleLogout}>
                <LogOut size={16} aria-hidden="true" />
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link to="/login" className="button button--primary button--small" onClick={closeMenu}>
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
