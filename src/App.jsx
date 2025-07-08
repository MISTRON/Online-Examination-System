import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ExamProvider } from './contexts/ExamContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ExamList from './pages/ExamList'
import CreateExam from './pages/CreateExam'
import TakeExam from './pages/TakeExam'
import ExamResults from './pages/ExamResults'
import AdminDashboard from './pages/AdminDashboard'
import ManageExams from './pages/ManageExams'
import ManageUsers from './pages/ManageUsers'
import TeacherLogin from './pages/TeacherLogin'
import ViewExam from './pages/ViewExam'
import EditExam from './pages/EditExam'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  return (
    <AuthProvider>
      <ExamProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/teacher-login" element={<TeacherLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="exams" element={<ExamList />} />
              <Route path="exam/:id" element={<TakeExam />} />
              <Route path="results" element={<ExamResults />} />
              
              {/* Admin Routes */}
              <Route path="admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
              <Route path="admin/exams" element={<PrivateRoute adminOnly><ManageExams /></PrivateRoute>} />
              <Route path="admin/exams/create" element={<PrivateRoute adminOnly><CreateExam /></PrivateRoute>} />
              <Route path="admin/exams/preview/:id" element={<PrivateRoute adminOnly><ViewExam /></PrivateRoute>} />
              <Route path="admin/exams/edit/:id" element={<PrivateRoute adminOnly><EditExam /></PrivateRoute>} />
              <Route path="admin/users" element={<PrivateRoute adminOnly><ManageUsers /></PrivateRoute>} />
            </Route>
          </Routes>
        </div>
      </ExamProvider>
    </AuthProvider>
  )
}

export default App 