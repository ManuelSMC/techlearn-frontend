import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const FOOTER_COLUMNS = [
  {
    title: 'Explorar',
    links: [
      { href: '/#cursos', label: 'Cursos' },
      { href: '/#categorias', label: 'Categorías' },
      { to: '/instructores', label: 'Instructores' },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { to: '/login', label: 'Iniciar sesión' },
      { to: '/registro', label: 'Crear cuenta' },
      { to: '/mis-cursos', label: 'Mis cursos' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <GraduationCap size={28} aria-hidden="true" />
            TechLearn
          </Link>
          <p className="footer__description">
            Cursos de tecnología impartidos por instructores con experiencia real en la industria.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} className="footer__column" aria-label={column.title}>
            <h2 className="footer__title">{column.title}</h2>
            <ul className="footer__list">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link className="footer__link" to={link.to}>
                      {link.label}
                    </Link>
                  ) : (
                    <a className="footer__link" href={link.href}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <address className="footer__column">
          <h2 className="footer__title">Contacto</h2>
          <ul className="footer__list">
            <li className="footer__contact">
              <Mail size={16} aria-hidden="true" />
              contacto@techlearn.com
            </li>
            <li className="footer__contact">
              <Phone size={16} aria-hidden="true" />
              +52 55 0000 0000
            </li>
            <li className="footer__contact">
              <MapPin size={16} aria-hidden="true" />
              Ciudad de México
            </li>
          </ul>
        </address>
      </div>

      <p className="footer__copy">© {new Date().getFullYear()} TechLearn. Todos los derechos reservados.</p>
    </footer>
  );
}
