import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="container page-content">
      <div className="empty-state">
        <Compass size={48} aria-hidden="true" />
        <h1 className="page-header__title">Página no encontrada</h1>
        <p>La dirección que buscas no existe o fue movida.</p>
        <Link to="/" className="button button--primary">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
