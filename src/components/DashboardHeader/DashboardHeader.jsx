/** Encabezado de los paneles con sus pestañas. */
export default function DashboardHeader({ title, text, tabs, activeTab, onTabChange }) {
  return (
    <header className="page-header page-header--tabs">
      <div className="container">
        <h1 className="page-header__title">{title}</h1>
        <p className="page-header__text">{text}</p>

        <div className="tabs" role="tablist" aria-label="Secciones del panel">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              className={`tabs__tab ${activeTab === id ? 'tabs__tab--active' : ''}`}
              onClick={() => onTabChange(id)}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
