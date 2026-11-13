import { useState } from 'react';
import { Search } from 'lucide-react';

/** Búsqueda que se aplica al enviar (Enter o botón), para no consultar la API en cada tecla. */
export default function SearchBox({ defaultValue = '', placeholder, onSearch }) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className="toolbar__search" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        className="form__input"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" className="button button--dark button--small" aria-label="Buscar">
        <Search size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
