import { BookOpen, UserRound } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import InstructorCourses from './instructor/InstructorCourses';
import InstructorProfile from './instructor/InstructorProfile';
import { useAuth } from '../hooks/useAuth';
import { useTab } from '../hooks/useTab';
import './InstructorPage.css';

const TABS = [
  { id: 'cursos', label: 'Mis cursos', icon: BookOpen },
  { id: 'perfil', label: 'Mi perfil', icon: UserRound },
];

export default function InstructorPage() {
  const { user } = useAuth();
  const [tab, setTab] = useTab('cursos');

  return (
    <main>
      <DashboardHeader
        title={`Hola, ${user.name.split(' ')[0]}`}
        text="Crea y administra tus cursos. Los cursos nuevos se publican cuando el administrador los aprueba."
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="container page-content">
        {tab === 'perfil' ? <InstructorProfile /> : <InstructorCourses />}
      </div>
    </main>
  );
}
