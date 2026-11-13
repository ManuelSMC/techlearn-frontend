import Hero from '../sections/Hero/Hero';
import Catalog from '../sections/Catalog/Catalog';
import FeaturedCategories from '../sections/FeaturedCategories/FeaturedCategories';
import FeaturedInstructors from '../sections/FeaturedInstructors/FeaturedInstructors';
import { useCatalog } from '../hooks/useCatalog';
import { useApi } from '../hooks/useApi';
import { getCategories } from '../api/categories.api';

export default function HomePage() {
  // El catálogo vive aquí porque dos secciones lo controlan:
  // los filtros del catálogo y las tarjetas de categorías destacadas.
  const catalog = useCatalog();
  const { data: categories } = useApi(getCategories);

  return (
    <main>
      <Hero />
      <Catalog catalog={catalog} categories={categories ?? []} />
      <FeaturedCategories categories={categories ?? []} onSelect={catalog.changeCategory} />
      <FeaturedInstructors />
    </main>
  );
}
