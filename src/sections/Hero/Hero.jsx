import { Award, Clock, Wallet } from 'lucide-react';
import './Hero.css';

const BENEFITS = [
  {
    icon: Clock,
    title: 'Aprende a tu ritmo',
    text: 'Accede a tus cursos cuando quieras y avanza según tu tiempo.',
  },
  {
    icon: Award,
    title: 'Instructores expertos',
    text: 'Profesionales con experiencia real en la industria tecnológica.',
  },
  {
    icon: Wallet,
    title: 'Cursos gratis y de pago',
    text: 'Empieza sin costo y crece con cursos especializados.',
  },
];

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__banner">
        <div className="container hero__content">
          <h1 id="hero-title" className="hero__title">
            Impulsa tu carrera en <span className="hero__highlight">tecnología</span>
          </h1>
          <p className="hero__text">
            Cursos de frontend, backend, bases de datos, cloud y más, creados por instructores que trabajan en lo que
            enseñan.
          </p>
          <a href="#cursos" className="button button--primary">
            Explorar cursos
          </a>
        </div>
      </div>

      <ul className="container hero__benefits">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="hero__benefit">
            <Icon className="hero__benefit-icon" size={28} aria-hidden="true" />
            <h2 className="hero__benefit-title">{title}</h2>
            <p className="hero__benefit-text">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
