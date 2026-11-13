import { GraduationCap } from 'lucide-react';
import './AuthCard.css';

/** Estructura común de las páginas de login y registro. */
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <main className="auth">
      <div className="auth__card">
        <aside className="auth__aside" aria-hidden="true">
          <GraduationCap size={40} />
          <p className="auth__aside-title">Aprende tecnología con instructores expertos</p>
          <p className="auth__aside-text">Frontend, backend, bases de datos, cloud y más, a tu ritmo.</p>
        </aside>

        <section className="auth__content">
          <h1 className="auth__title">{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
          <p className="auth__footer">{footer}</p>
        </section>
      </div>
    </main>
  );
}
