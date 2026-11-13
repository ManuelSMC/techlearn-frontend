import { BookOpen, FolderTree, LayoutDashboard, Users } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import AdminOverview from './admin/AdminOverview';
import AdminCourses from './admin/AdminCourses';
import AdminCategories from './admin/AdminCategories';
import AdminUsers from './admin/AdminUsers';
import { useTab } from '../hooks/useTab';

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { id: 'cursos', label: 'Cursos', icon: BookOpen },
  { id: 'categorias', label: 'Categorías', icon: FolderTree },
  { id: 'usuarios', label: 'Usuarios', icon: Users },
];

export default function AdminPage() {
  const [tab, setTab, searchParams] = useTab('resumen');

  const renderTab = () => {
    switch (tab) {
      case 'cursos':
        // key: si se llega desde "Revisar cursos", los filtros se reinician con ese estado
        return <AdminCourses key={searchParams.get('status') ?? 'all'} initialStatus={searchParams.get('status') ?? ''} />;
      case 'categorias':
        return <AdminCategories />;
      case 'usuarios':
        return <AdminUsers />;
      default:
        return <AdminOverview onReviewPending={() => setTab('cursos', { status: 'draft' })} />;
    }
  };

  return (
    <main>
      <DashboardHeader
        title="Panel de administración"
        text="Revisa y publica cursos, administra categorías y gestiona las cuentas de la plataforma."
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="container page-content">{renderTab()}</div>
    </main>
  );
}
