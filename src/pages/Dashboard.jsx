import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Calendar,
  ArrowRight,
  Bell,
  Moon,
  Sun,
  User,
  Trophy,
  Target,
  Award,
  Star,
  Zap,
  BarChart3,
  Play,
  Eye,
  Clock as ClockIcon,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Activity,
  ChevronUp
} from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [nextExam, setNextExam] = useState(null)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 })
  const [expandedPanels, setExpandedPanels] = useState({
    recentExams: true,
    quickActions: true,
    performance: true
  })
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)
  const [exams, setExams] = useState([])
  const [results, setResults] = useState([])
  const [recentNotifications, setRecentNotifications] = useState([])
  const [dismissedNotifications, setDismissedNotifications] = useState(() => {
    // Load dismissed notifications from localStorage
    const stored = localStorage.getItem('dismissedNotifications')
    return stored ? JSON.parse(stored) : []
  })

  // Calculate statistics
  const totalExams = exams.length
  const activeExams = exams.filter(exam => exam.status === 'active').length
  const upcomingExams = exams.filter(exam => exam.status === 'upcoming').length
  const completedExams = results.length
  const passedExams = results.filter(result => result.passed).length
  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + result.percentage, 0) / results.length)
    : 0

  const recentExams = exams.slice(0, 3)
  const recentResults = results.slice(0, 3)

  const stats = [
    {
      title: 'Total Exams',
      value: totalExams,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Exams',
      value: activeExams,
      icon: Clock,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Completed',
      value: completedExams,
      icon: CheckCircle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Average Score',
      value: `${averageScore}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  // Countdown timer effect
  useEffect(() => {
    // Fetch next exam
    const fetchNextExam = async () => {
      try {
        if (!user) return;
        const response = await fetch(`/api/exams/next/${user.id || user._id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setNextExam(null); // No next exam
          } else {
            throw new Error('Failed to fetch next exam');
          }
        } else {
          const data = await response.json();
          setNextExam(data);
        }
      } catch (err) {
        setNextExam(null);
        // Optionally show a toast or friendly message
      }
    };
    fetchNextExam();
  }, [user]);

  // Handle swipe to open sidebar (from left edge)
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
    const main = document.getElementById('dashboard-main-touch')
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

  useEffect(() => {
    // Fetch real exams
    const fetchExams = async () => {
      try {
        const response = await fetch('/api/exams')
        if (!response.ok) throw new Error('Failed to fetch exams')
        const data = await response.json()
        setExams(data)
      } catch (err) {
        toast.error('Failed to fetch exams')
      }
    }
    // Fetch real results for the user
    const fetchResults = async () => {
      try {
        if (!user) return
        const response = await fetch(`/api/auth/results/user/${user.id || user._id}`)
        if (!response.ok) throw new Error('Failed to fetch results')
        const data = await response.json()
        setResults(data)
      } catch (err) {
        toast.error('Failed to fetch results')
      }
    }
    fetchExams()
    fetchResults()
  }, [user])

  useEffect(() => {
    // Fetch recent exams for notifications
    const fetchRecentExams = async () => {
      try {
        const response = await fetch('/api/exams/recent')
        if (!response.ok) throw new Error('Failed to fetch recent exams')
        const data = await response.json()
        setRecentNotifications(data)
      } catch (err) {
        // Optionally show a toast or ignore
      }
    }
    fetchRecentExams()
  }, [])

  const handleDismissNotification = (examId) => {
    const updated = [...dismissedNotifications, examId]
    setDismissedNotifications(updated)
    localStorage.setItem('dismissedNotifications', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen">
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">ExamVerse</h2>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          {[
            { path: '/', icon: BookOpen, label: 'Dashboard' },
            { path: '/exams', icon: Clock, label: 'Available Exams' },
            { path: '/results', icon: BarChart3, label: 'My Results' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          
          {/* Logout option in mobile sidebar */}
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
      <div className="lg:ml-0" id="dashboard-main-touch">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Menu size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notifications</h3>
                      {recentNotifications.filter(exam => !dismissedNotifications.includes(exam._id)).length === 0 ? (
                        <div className="text-gray-500 text-sm">No new notifications</div>
                      ) : (
                        recentNotifications.filter(exam => !dismissedNotifications.includes(exam._id)).map((exam) => (
                          <div key={exam._id} className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                            <div>
                              <div className="font-medium text-blue-800 dark:text-blue-200">New Exam: {exam.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Scheduled for {new Date(exam.startDate).toLocaleString()}</div>
                            </div>
                            <button onClick={() => handleDismissNotification(exam._id)} className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <X size={18} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {`Welcome back${user && user.name ? ", " + user.name : ""}! `}
            </h1>
            <p className="text-blue-100">
              Ready to ace your next exam? You have {activeExams} active exams waiting for you.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor} dark:bg-gray-700`}>
                    <stat.icon size={24} className={stat.textColor} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Exams */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Exams</h2>
                  <Link to="/exams" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                    View all
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentExams.length > 0 ? (
                    recentExams.map((exam, idx) => (
                      <div key={exam.id || exam._id || idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
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
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {exam.status}
                          </span>
                          <Link to={`/exam/${exam.id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No exams available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Results</h2>
                <Link to="/results" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
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
                    <p className="text-gray-500 dark:text-gray-400">No exam results yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Take your first exam to see results here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Performance Analytics & Next Exam */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Performance Analytics</h2>
              <div className="flex items-center justify-center">
                <div className="relative">
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
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageScore}%</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Exam Countdown */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Next Exam</h2>
              <div className="text-center">
                {nextExam ? (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{nextExam.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {nextExam.date.toLocaleDateString()} at {nextExam.time}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{countdown.days}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{countdown.hours}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{countdown.minutes}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Minutes</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-center">No upcoming exams</div>
                )}
              </div>
            </div>
          </div>

          {/* Gamification Badges */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Badges will be dynamically populated based on user's achievements */}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/exams"
                className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-700"
              >
                <Play size={24} className="text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Take Exam</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start a new examination</p>
                </div>
              </Link>
              
              <Link
                to="/results"
                className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors border border-green-200 dark:border-green-700"
              >
                <Eye size={24} className="text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">View Results</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Check your performance</p>
                </div>
              </Link>
              
              <Link
                to="/exams"
                className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors border border-purple-200 dark:border-purple-700"
              >
                <Calendar size={24} className="text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Schedule</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View upcoming exams</p>
                </div>
              </Link>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-around py-2">
            <Link to="/" className="flex flex-col items-center p-2 text-blue-600 dark:text-blue-400">
              <BookOpen size={20} />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link to="/exams" className="flex flex-col items-center p-2 text-gray-400 dark:text-gray-500">
              <Clock size={20} />
              <span className="text-xs mt-1">Exams</span>
            </Link>
            <Link to="/results" className="flex flex-col items-center p-2 text-gray-400 dark:text-gray-500">
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
    </div>
  )
}

export default Dashboard 