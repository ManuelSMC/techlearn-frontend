import { ArrowRight } from 'lucide-react';
import './FeaturedCategories.css';

const MAX_CATEGORIES = 4;

/** Las categorías con más cursos publicados. Al elegir una, se filtra el catálogo. */
export default function FeaturedCategories({ categories, onSelect }) {
  const featured = [...categories]
    .filter((category) => category.publishedCourses > 0)
    .sort((a, b) => b.publishedCourses - a.publishedCourses)
    .slice(0, MAX_CATEGORIES);

  if (featured.length === 0) return null;

  const handleSelect = (slug) => {
    onSelect(slug);
    document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categorias" className="section featured-categories" aria-labelledby="categories-title">
      <div className="container">
        <header className="section__header">
          <h2 id="categories-title" className="section__title">
            Categorías destacadas
          </h2>
        </header>

        <ul className="featured-categories__grid">
          {featured.map((category) => (
            <li key={category.id}>
              <button type="button" className="featured-categories__card" onClick={() => handleSelect(category.slug)}>
                {category.imageUrl && (
                  <img className="featured-categories__image" src={category.imageUrl} alt="" loading="lazy" />
                )}
                <span className="featured-categories__name">{category.name}</span>
                <span className="featured-categories__count">
                  {category.publishedCourses} {category.publishedCourses === 1 ? 'curso' : 'cursos'}
                </span>
                <ArrowRight className="featured-categories__icon" size={20} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
