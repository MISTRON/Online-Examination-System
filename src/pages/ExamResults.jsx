import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useExam } from '../contexts/ExamContext'
import { Link } from 'react-router-dom'
import { 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar,
  Clock,
  Award,
  BarChart3,
  User,
  Menu,
  X,
  BookOpen,
  LogOut,
  Moon,
  Sun,
  Bell,
  Star,
  Target,
  Zap,
  Lightbulb,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  PieChart,
  Activity,
  Users,
  UserCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

const ExamResults = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth()
  const { examResults } = useExam()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [expandedPanels, setExpandedPanels] = useState({
    insights: true,
    activity: true,
    achievements: true,
    tips: true
  })
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!user) return;
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/auth/results/user/${user.id}`)
        if (!response.ok) throw new Error('Failed to fetch results')
        const data = await response.json()
        setResults(data)
      } catch (err) {
        toast.error('Failed to fetch results')
      }
    }
    fetchResults()
  }, [user])

  const userResults = results
  const totalExams = userResults.length
  const passedExams = userResults.filter(result => result.passed).length
  const failedExams = totalExams - passedExams
  const averageScore = userResults.length > 0 
    ? Math.round(userResults.reduce((sum, result) => sum + result.percentage, 0) / userResults.length)
    : 0

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400'
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBadge = (percentage) => {
    if (percentage >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
    if (percentage >= 80) return { text: 'Good', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' }
    if (percentage >= 70) return { text: 'Average', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
  }

  const handleLogout = () => {
    logout()
  }

  const togglePanel = (panel) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }))
  }

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
    const main = document.getElementById('exam-results-main-touch')
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

  // Statistics
  const totalResults = results.length
  const passedResults = results.filter(r => r.passed).length
  const failedResults = totalResults - passedResults
  const stats = [
    { title: 'Total Results', value: totalResults, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', icon: BarChart3 },
    { title: 'Passed', value: passedResults, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20', icon: UserCheck },
    { title: 'Failed', value: failedResults, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20', icon: Users },
    { title: 'Avg Score', value: `${averageScore}%`, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', icon: Award },
  ]

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
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
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
      <div className="lg:ml-0" id="exam-results-main-touch">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-4"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Results</h1>
            <p className="text-gray-600 dark:text-gray-400">View all exam submissions and performance</p>
          </div>
        </div>
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          ))}
        </div>
        {/* Performance Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Performance Overview</h2>
          <div className="space-y-4">
            {userResults.length > 0 ? (
              userResults.map((result, idx) => {
                const scoreBadge = getScoreBadge(result.percentage)
                return (
                  <div key={result._id || result.id || idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        result.passed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                      }`}>
                        {result.passed ? (
                          <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle size={24} className="text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{result.examTitle}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {result.submittedAt && result.submittedAt instanceof Date ? result.submittedAt.toLocaleDateString() : 'Date not available'}
                          </span>
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {result.submittedAt && result.submittedAt instanceof Date ? result.submittedAt.toLocaleTimeString() : 'Time not available'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${getScoreColor(result.percentage)}`}>
                          {result.percentage}%
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${scoreBadge.color}`}>
                          {scoreBadge.text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {result.score}/{result.totalScore} points
                      </p>
                      {!result.passed && (
                        <div className="flex space-x-2 mt-2">
                          <button className="flex items-center space-x-1 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                            <RefreshCw size={14} />
                            <span>Retake</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                            <Eye size={14} />
                            <span>Review</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <BarChart3 size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No exam results yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Take your first exam to see results here</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Insights</h2>
              <button 
                onClick={() => togglePanel('insights')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {expandedPanels.insights ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            {expandedPanels.insights && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Pass Rate</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${totalExams > 0 ? (passedExams / totalExams) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{averageScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${averageScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pie Chart Visualization */}
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - averageScore / 100)}`}
                        className="text-blue-600 dark:text-blue-400 transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{averageScore}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Overall</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <button 
                onClick={() => togglePanel('activity')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {expandedPanels.activity ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            {expandedPanels.activity && (
              <div className="space-y-4">
                {userResults.slice(0, 5).map((result, idx) => (
                  <div key={result._id || result.id || idx} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      result.passed ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{result.examTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {result.submittedAt && result.submittedAt instanceof Date ? result.submittedAt.toLocaleDateString() : 'Date not available'}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(result.percentage)}`}>
                      {result.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Achievements</h2>
            <button 
              onClick={() => togglePanel('achievements')}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {expandedPanels.achievements ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {expandedPanels.achievements && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Achievements will be populated dynamically based on backend data */}
            </div>
          )}
        </div>

        {/* Tips for Improvement */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tips for Improvement</h2>
            <button 
              onClick={() => togglePanel('tips')}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {expandedPanels.tips ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {expandedPanels.tips && (
            <div className="space-y-4">
              {/* Tips for improvement will be populated dynamically based on backend data */}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center p-2 text-gray-400 dark:text-gray-500">
            <BookOpen size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link to="/exams" className="flex flex-col items-center p-2 text-gray-400 dark:text-gray-500">
            <Clock size={20} />
            <span className="text-xs mt-1">Exams</span>
          </Link>
          <Link to="/results" className="flex flex-col items-center p-2 text-blue-600 dark:text-blue-400">
            <BarChart3 size={20} />
            <span className="text-xs mt-1">Results</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center p-2 text-red-500 dark:text-red-400"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExamResults 