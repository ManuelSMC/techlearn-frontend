import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

/** Estructura común: header, contenido de la página y footer. */
export default function Layout() {
  const { pathname, hash } = useLocation();

  // Al cambiar de página se empieza desde arriba (salvo enlaces a una sección, como /#cursos).
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
