import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyCoursesPage from './pages/MyCoursesPage';
import InstructorPage from './pages/InstructorPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        <Route element={<ProtectedRoute roles={['user']} />}>
          <Route path="/mis-cursos" element={<MyCoursesPage />} />
        </Route>
        <Route element={<ProtectedRoute roles={['instructor']} />}>
          <Route path="/instructor" element={<InstructorPage />} />
        </Route>
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
