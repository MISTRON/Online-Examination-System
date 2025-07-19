import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useExam } from '../contexts/ExamContext'
import { 
  Home, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Settings, 
  Users,
  Plus,
  User,
  LogOut
} from 'lucide-react'

const Sidebar = () => {
  const { user, logout } = useAuth()
  let exams = []
  let examResults = []
  let contextError = null
  try {
    const examContext = useExam()
    exams = examContext.exams
    examResults = examContext.examResults
  } catch (err) {
    contextError = err
  }

  if (contextError) {
    return (
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 z-30 flex items-center justify-center">
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Sidebar Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mt-2">Sidebar must be used within an <b>ExamProvider</b> context.</p>
          <p className="text-xs text-gray-400 mt-2">{contextError.message}</p>
        </div>
      </aside>
    )
  }

  // Calculate live stats for students
  let examsTaken = 0
  let averageScore = 0
  let activeExams = 0

  if (user?.role !== 'admin') {
    examsTaken = examResults ? examResults.length : 0
    averageScore = examsTaken > 0 ? Math.round(examResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / examsTaken) : 0
    activeExams = exams ? exams.filter(exam => exam.status === 'active').length : 0
  }

  const studentMenuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/exams', icon: BookOpen, label: 'Available Exams' },
    { path: '/results', icon: BarChart3, label: 'My Results' },
  ]

  const adminMenuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/exams', icon: BookOpen, label: 'Manage Exams' },
    { path: '/admin/exams/create', icon: Plus, label: 'Create Exam' },
    { path: '/admin/users', icon: Users, label: 'Manage Users' },
  ]

  const menuItems = user?.role === 'admin' ? adminMenuItems : studentMenuItems

  const handleLogout = () => {
    logout()
  }

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 z-30">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <img src="graduation-hat.png" alt="Graduation Cap" className="w-10 h-10" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">MUJExams</h2>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      {user?.role !== 'admin' && (
        <div className="px-6 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role === 'student' ? 'Student' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="mt-6">
        <div className="px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              {...((item.path === '/admin' || item.path === '/admin/exams' || item.path === '/exams' || item.path === '/' || item.path === '/results' || item.path === '/admin/users') ? { end: true } : {})}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-2 border-primary-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {/* Logout option */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-3 rounded-lg w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Quick Stats - only for students */}
      {/* Removed Quick Stats section as requested */}
    </aside>
  )
}

export default Sidebar 