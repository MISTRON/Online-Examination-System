import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useExam } from '../contexts/ExamContext'
import { Link } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  TrendingUp,
  Plus,
  Settings,
  Activity,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Award,
  Star,
  Zap
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'
import CountUp from 'react-countup'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FaUserCircle } from 'react-icons/fa'

const AdminDashboard = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth()
  const { exams, examResults } = useExam()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [expandedPanels, setExpandedPanels] = useState({
    insights: true,
    activity: true,
    achievements: true
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)

  // Calculate statistics
  const totalExams = exams.length
  const activeExams = exams.filter(exam => exam.status === 'active').length
  const totalResults = examResults.length
  const averageScore = examResults.length > 0 
    ? Math.round(examResults.reduce((sum, result) => sum + result.percentage, 0) / examResults.length)
    : 0
  const passRate = examResults.length > 0 
    ? Math.round((examResults.filter(result => result.passed).length / examResults.length) * 100)
    : 0

  const recentExams = exams.slice(0, 3)
  const recentResults = examResults.slice(0, 3)

  const stats = [
    {
      title: 'Total Exams',
      value: totalExams,
      icon: BookOpen,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
      textColor: 'text-primary-600 dark:text-primary-400',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Active Exams',
      value: activeExams,
      icon: Activity,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      change: '+1',
      changeType: 'positive'
    },
    {
      title: 'Total Submissions',
      value: totalResults,
      icon: BarChart3,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      change: '+12',
      changeType: 'positive'
    },
    {
      title: 'Average Score',
      value: `${averageScore}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      change: '+5%',
      changeType: 'positive'
    }
  ]

  // Handle swipe to open/close sidebar (from left edge)
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        setTouchStartX(e.touches[0].clientX)
      }
    }
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length === 1) {
        setTouchEndX(e.touches[0].clientX)
      }
    }
    const handleTouchEnd = () => {
      if (touchStartX !== null && touchEndX !== null) {
        // Swipe right to open (from left edge, only if sidebar is closed)
        if (!sidebarOpen && touchStartX < 40 && touchEndX - touchStartX > 60) {
          setSidebarOpen(true)
        }
        // Swipe left to close (if sidebar is open)
        if (sidebarOpen && touchStartX > 40 && touchStartX - touchEndX > 60) {
          setSidebarOpen(false)
        }
      }
      setTouchStartX(null)
      setTouchEndX(null)
    }
    // Attach to main content area
    const main = document.getElementById('admin-dashboard-main-touch')
    if (main) {
      main.addEventListener('touchstart', handleTouchStart)
      main.addEventListener('touchmove', handleTouchMove)
      main.addEventListener('touchend', handleTouchEnd)
    }
    return () => {
      if (main) {
        main.removeEventListener('touchstart', handleTouchStart)
        main.removeEventListener('touchmove', handleTouchMove)
        main.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [sidebarOpen, touchStartX, touchEndX])

  const handleLogout = () => {
    logout()
  }

  // Helper: Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Helper: Avatar (use user.avatar if available, else placeholder)
  const adminAvatar = user?.avatar || null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h2>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <nav className="mt-6 px-3">
          {[
            { path: '/admin', icon: BarChart3, label: 'Dashboard' },
            { path: '/admin/exams', icon: BookOpen, label: 'Manage Exams' },
            { path: '/admin/users', icon: Users, label: 'Manage Users' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-0" id="admin-dashboard-main-touch">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-transform duration-200 hover:scale-110"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                {adminAvatar ? (
                  <img src={adminAvatar} alt="Admin avatar" className="w-10 h-10 rounded-full object-cover border-2 border-primary-500" />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-primary-600 dark:text-primary-300" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">System Administrator</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
                  aria-label="Show notifications"
                  aria-haspopup="true"
                  aria-expanded={notificationsOpen}
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">New exam submission</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">John Doe completed JavaScript Basics</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">System update</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">New features have been added</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white mb-8 transition-colors duration-500">
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.name || 'Admin'}! 
            </h1>
            <p className="text-primary-100">
              Manage your examination system and monitor student performance. You have {activeExams} active exams.
            </p>
          </div>

          {/* Statistics Grid with Animated Counters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      <CountUp end={parseInt(stat.value)} duration={1.2} separator="," />{typeof stat.value === 'string' && stat.value.includes('%') ? '%' : ''}
                    </p>
                    <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stat.change} from last week
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor} transition-transform duration-200 group-hover:scale-110`}>
                    <stat.icon size={24} className={stat.textColor} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Submission Trend</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={[]}>
                  <XAxis dataKey="Date" hide />
                  <YAxis hide />
                  <Bar dataKey="Submissions" fill="#6366f1" radius={[4,4,0,0]} />
                  <RechartsTooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Average Score (Last 10)</h3>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={[]}>
                  <XAxis dataKey="Date" hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="Score" stroke="#10b981" strokeWidth={2} dot={false} />
                  <RechartsTooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Pass Rate (Last 10)</h3>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={[]}>
                  <XAxis dataKey="Date" hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="Passed" stroke="#f59e42" strokeWidth={2} dot={false} />
                  <RechartsTooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Exam Type Distribution</h3>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={[]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} label>
                    {[]}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Most Attempted Exam */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center hover:shadow-md transition-shadow duration-300">
              <BookOpen size={28} className="text-primary-500 mb-2 animate-bounce" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Most Attempted Exam</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {(() => {
                  const freq = examResults.reduce((acc, r) => {
                    acc[r.examTitle] = (acc[r.examTitle] || 0) + 1; return acc
                  }, {})
                  const top = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]
                  return top ? `${top[0]} (${top[1]})` : 'N/A'
                })()}
              </p>
            </div>
            {/* Top Performer This Week */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center hover:shadow-md transition-shadow duration-300">
              <Award size={28} className="text-purple-500 mb-2 animate-pulse" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Top Performer This Week</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {(() => {
                  const weekAgo = Date.now() - 7*24*60*60*1000
                  const weekResults = examResults.filter(r => new Date(r.submittedAt).getTime() > weekAgo)
                  const top = weekResults.sort((a,b)=>b.percentage-a.percentage)[0]
                  return top ? `${top.studentName || 'N/A'} (${top.percentage}%)` : 'N/A'
                })()}
              </p>
            </div>
            {/* Active vs Inactive Students */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center hover:shadow-md transition-shadow duration-300">
              <Users size={28} className="text-green-500 mb-2 animate-spin-slow" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Active vs Inactive Students</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {(() => {
                  // Mock: count unique students in results as active
                  const active = new Set(examResults.map(r=>r.studentName)).size
                  const total = 100 // TODO: replace with real user count
                  return `${active} active / ${total-active} inactive`
                })()}
              </p>
            </div>
            {/* Exams with Lowest Score */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center hover:shadow-md transition-shadow duration-300">
              <TrendingUp size={28} className="text-red-500 mb-2 animate-wiggle" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Exam with Lowest Score</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {(() => {
                  const byExam = examResults.reduce((acc, r) => {
                    if (!acc[r.examTitle]) acc[r.examTitle] = []
                    acc[r.examTitle].push(r.percentage)
                    return acc
                  }, {})
                  const lowest = Object.entries(byExam).map(([k,v])=>[k, v.reduce((a,b)=>a+b,0)/v.length])
                    .sort((a,b)=>a[1]-b[1])[0]
                  return lowest ? `${lowest[0]} (${Math.round(lowest[1])}%)` : 'N/A'
                })()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Exams */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Exams</h2>
                <Link to="/admin/exams" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentExams.map((exam, idx) => (
                  <div key={exam.id || exam._id || idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                        <BookOpen size={20} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{exam.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{exam.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        exam.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : exam.status === 'upcoming'
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {exam.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Submissions</h2>
                <Link to="/results" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentResults.length > 0 ? (
                  recentResults.map((result, idx) => (
                    <div key={result.id || result._id || idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          result.passed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                        }`}>
                          {result.passed ? (
                            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle size={20} className="text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{result.examTitle}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{result.percentage}%</p>
                        <p className={`text-xs font-medium ${
                          result.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No submissions yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Students will appear here once they take exams</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/exams/create"
                className="flex items-center space-x-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors border border-primary-200 dark:border-primary-700"
              >
                <Plus size={24} className="text-primary-600 dark:text-primary-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Create Exam</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add a new examination</p>
                </div>
              </Link>
              
              <Link
                to="/admin/exams"
                className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors border border-green-200 dark:border-green-700"
              >
                <BookOpen size={24} className="text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Manage Exams</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Edit and organize exams</p>
                </div>
              </Link>
              
              <Link
                to="/admin/users"
                className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors border border-purple-200 dark:border-purple-700"
              >
                <Users size={24} className="text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Manage Users</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View and manage students</p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard 