import { useState, useEffect, Fragment } from 'react'
import { useExam } from '../contexts/ExamContext'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Plus,
  Eye,
  MoreVertical,
  CheckSquare,
  Square,
  Copy,
  Archive,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  BarChart3,
  Users,
  ChevronDown,
  ChevronUp,
  UserPlus,
  SortAsc,
  SortDesc,
  ListOrdered,
  Type,
  History
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Tooltip as ReactTooltip } from 'react-tooltip'

const ManageExams = () => {
  const { exams, deleteExam } = useExam()
  const { darkMode } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedExams, setSelectedExams] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [sortBy, setSortBy] = useState('date') // 'date', 'title', 'status'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc', 'desc'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)
  const [expandedExam, setExpandedExam] = useState(null)
  const [showVersionModal, setShowVersionModal] = useState(false)
  const [versionExam, setVersionExam] = useState(null)
  const [stats, setStats] = useState([
    { title: 'Total Exams', value: 0, icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Submissions', value: 0, icon: BarChart3, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { title: 'Pass Rate', value: '0%', icon: Clock, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { title: 'Avg. Score', value: '0%', icon: Edit, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' }
  ])

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.startDate) - new Date(b.startDate)
        : new Date(b.startDate) - new Date(a.startDate)
    }
    if (sortBy === 'title') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    }
    if (sortBy === 'status') {
      return sortOrder === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    }
    return 0
  })

  useEffect(() => {
    // Fetch stats for the first exam as an example (or you can aggregate for all exams)
    if (filteredExams.length > 0) {
      const examId = filteredExams[0].id || filteredExams[0]._id;
      fetch(`/api/exams/${examId}/stats`)
        .then(res => res.json())
        .then(data => {
          setStats([
            { title: 'Assigned', value: data.assigned, icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
            { title: 'Submissions', value: data.submissions, icon: BarChart3, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
            { title: 'Pass Rate', value: `${data.passRate}%`, icon: Clock, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
            { title: 'Avg. Score', value: `${data.avgScore}%`, icon: Edit, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' }
          ]);
        });
    }
  }, [filteredExams]);

  const handleDelete = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      try {
        const success = await deleteExam(examId);
        if (success) {
          toast.success('Exam deleted successfully');
          setSelectedExams(prev => prev.filter(id => id !== examId));
        }
        // No success toast if not successful
      } catch (error) {
        // Error toast is already handled in ExamContext
      }
    }
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedExams.length} exams? This action cannot be undone.`)) {
      try {
        const results = await Promise.all(selectedExams.map(id => deleteExam(id)));
        const successCount = results.filter(Boolean).length;
        if (successCount > 0) {
          toast.success(`${successCount} exam(s) deleted successfully`);
          setSelectedExams([]);
        }
        // No success toast if none deleted
      } catch (error) {
        // Error toast is already handled in ExamContext
      }
    }
  }

  const toggleExamSelection = (examId) => {
    setSelectedExams(prev => 
      prev.includes(examId)
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    )
  }

  const toggleAllExams = () => {
    setSelectedExams(prev => 
      prev.length === filteredExams.length
        ? []
        : filteredExams.map(exam => exam.id || exam._id)
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  // Status filter pills
  const statusPills = [
    { label: 'All', value: 'all', color: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: BarChart3 },
    { label: 'Active', value: 'active', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: Clock },
    { label: 'Upcoming', value: 'upcoming', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Calendar },
    { label: 'Draft', value: 'draft', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Edit },
    { label: 'Closed', value: 'completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: Archive },
  ]

  // Accessibility: helper for focus ring
  const focusRing = 'focus:outline-none focus:ring-2 focus:ring-blue-500'

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
    const main = document.getElementById('manage-exams-main-touch')
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
    // You may want to use your logout logic here
    window.location.href = '/login'
  }

  // Bulk action handlers (mock for now)
  const handleBulkAssign = () => toast.success('Assigning selected exams...')
  const handleBulkDuplicate = () => toast.success('Duplicating selected exams...')
  const handleBulkArchive = () => toast.success('Archiving selected exams...')

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
      <div className="lg:ml-8" id="manage-exams-main-touch">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-4"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Exams</h1>
            <p className="text-gray-600 dark:text-gray-400">Create, edit, and organize examinations</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Link
              to="/admin/exams/create"
              className="btn-primary"
            >
              <Plus size={16} className="mr-2" />
              Create Exam
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-x-3 gap-y-2 py-3 px-4 mb-6 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {statusPills.map(pill => (
            <button
              key={pill.value}
              onClick={() => setStatusFilter(pill.value)}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${pill.color} ${statusFilter === pill.value ? 'ring-2 ring-blue-500' : ''}`}
              aria-pressed={statusFilter === pill.value}
              aria-label={`Filter by ${pill.label}`}
            >
              <pill.icon size={16} />
              {pill.label}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                  aria-label="Sort exams"
                >
                  <option value="date">⏳ Date</option>
                  <option value="title">🔤 Title</option>
                  <option value="status">📋 Status</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <ChevronDown size={18} />
                </span>
              </div>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                data-tip data-for="sort-order-tip"
                aria-label={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
              >
                {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
              </button>
              <ReactTooltip id="sort-order-tip" effect="solid">
                <span>Toggle sort order ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})</span>
              </ReactTooltip>
            </div>
          </div>
        </div>

        {/* Exam List */}
        {filteredExams.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative">
            {/* Bulk Selection Action Bar */}
            {selectedExams.length > 0 && (
              <div className="fixed left-0 right-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg flex items-center justify-between px-8 py-3 animate-fade-in-up transition-all" role="status" aria-live="polite">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{selectedExams.length} selected</span>
                  <button onClick={handleBulkAssign} data-tip data-for="bulk-assign-tip" aria-label="Assign" className={focusRing} tabIndex={0}>
                    <UserPlus size={20} className="text-green-500 hover:scale-110 transition-transform" />
                  </button>
                  <button onClick={handleBulkDuplicate} data-tip data-for="bulk-duplicate-tip" aria-label="Duplicate" className={focusRing} tabIndex={0}>
                    <Copy size={20} className="text-purple-500 hover:scale-110 transition-transform" />
                  </button>
                  <button onClick={handleBulkArchive} data-tip data-for="bulk-archive-tip" aria-label="Archive" className={focusRing} tabIndex={0}>
                    <Archive size={20} className="text-gray-500 hover:scale-110 transition-transform" />
                  </button>
                  <button onClick={handleBulkDelete} data-tip data-for="bulk-delete-tip" aria-label="Delete" className={focusRing} tabIndex={0}>
                    <Trash2 size={20} className="text-red-500 hover:scale-110 transition-transform" />
                  </button>
                  <ReactTooltip id="bulk-assign-tip" effect="solid"><span>Assign</span></ReactTooltip>
                  <ReactTooltip id="bulk-duplicate-tip" effect="solid"><span>Duplicate</span></ReactTooltip>
                  <ReactTooltip id="bulk-archive-tip" effect="solid"><span>Archive</span></ReactTooltip>
                  <ReactTooltip id="bulk-delete-tip" effect="solid"><span>Delete</span></ReactTooltip>
                </div>
                <button onClick={() => setSelectedExams([])} aria-label="Clear selection" className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-4 ${focusRing}`} tabIndex={0}>
                  <X size={22} />
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">
                      <div className="flex items-center">
                        <button
                          onClick={toggleAllExams}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {selectedExams.length === filteredExams.length ? (
                            <CheckSquare size={18} />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Exam</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Questions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Start Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <img src={require('../illustration.svg')} alt="No exams illustration: a person with a checklist" className="mx-auto mb-4 w-40 opacity-80" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">No exams yet. Click <Link to='/admin/exams/create' className='text-blue-600 dark:text-blue-400 underline'>Create Exam</Link> to get started!</p>
                      </td>
                    </tr>
                  ) : null}
                  {filteredExams.length > 0 && filteredExams.map((exam, idx) => (
                    <Fragment key={exam.id || exam._id || idx}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedExams.includes(exam.id || exam._id)}
                            onChange={() => toggleExamSelection(exam.id || exam._id)}
                            aria-label={`Select exam ${exam.title}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {exam.title}
                            {/* Version Control Indicator */}
                            {exam.versions && exam.versions.length > 1 && (
                              <button
                                onClick={() => { setShowVersionModal(true); setVersionExam(exam) }}
                                aria-label="View version history"
                                className="ml-1 text-gray-400 hover:text-blue-500 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                                data-tip data-for={`version-tip-${exam.id}`}
                              >
                                <History size={16} />
                              </button>
                            )}
                            {exam.versions && exam.versions.length > 1 && (
                              <ReactTooltip id={`version-tip-${exam.id}`} effect="solid">
                                <span>This exam has previous versions. Click to view history.</span>
                              </ReactTooltip>
                            )}
                          </div>
                          {/* Draft Progress Indicator */}
                          {exam.status === 'draft' && (
                            <div className="mt-1">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${exam.draftProgress ?? Math.floor(30 + Math.random() * 60)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium mt-1 inline-block">
                                {exam.draftProgress ?? Math.floor(30 + Math.random() * 60)}% Complete
                              </span>
                            </div>
                          )}
                          {/* Exam Tags */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(exam.tags || []).map((tag, tagIdx) => (
                              <span key={tag.id || tag._id || tagIdx} className={`px-2 py-0.5 rounded-full text-xs font-medium ${tag.color || 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>{tag.label}</span>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{exam.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(exam.status)}`}>{exam.status}</span>
                        </td>
                        <td className="px-4 py-3">{formatDuration(exam.duration)}</td>
                        <td className="px-4 py-3">{exam.questions?.length || 0}</td>
                        <td className="px-4 py-3">{new Date(exam.startDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <Link to={`/admin/exams/preview/${exam.id || exam._id}`}
                            data-tip data-for={`preview-tip-${exam.id}`}
                            aria-label="Preview exam"
                            className={focusRing}
                            onClick={() => console.log('Navigating to preview for exam id:', exam.id || exam._id)}
                          >
                            <Eye size={18} className="text-blue-500 hover:scale-110 transition-transform" />
                          </Link>
                          <Link to={`/admin/exams/edit/${exam.id || exam._id}`}
                            data-tip data-for={`edit-tip-${exam.id}`}
                            aria-label="Edit exam"
                            className={focusRing}
                            onClick={() => console.log('Navigating to edit for exam id:', exam.id || exam._id)}
                          >
                            <Edit size={18} className="text-yellow-500 hover:scale-110 transition-transform" />
                          </Link>
                          <button
                            onClick={() => {
                              console.log('Deleting exam:', exam);
                              handleDelete(exam.id || exam._id);
                            }}
                            data-tip data-for={`delete-tip-${exam.id}`}
                            aria-label="Delete exam"
                            className={focusRing}
                          >
                            <Trash2 size={18} className="text-red-500 hover:scale-110 transition-transform" />
                          </button>
                          <button data-tip data-for={`duplicate-tip-${exam.id}`} aria-label="Duplicate exam" className={focusRing}>
                            <Copy size={18} className="text-purple-500 hover:scale-110 transition-transform" />
                          </button>
                          <button onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)} aria-label={expandedExam === exam.id ? 'Collapse stats' : 'Expand stats'} className={`ml-2 text-gray-400 hover:text-blue-500 transition-transform ${focusRing}`}>
                            {expandedExam === exam.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <ReactTooltip id={`preview-tip-${exam.id}`} effect="solid"><span>Preview</span></ReactTooltip>
                          <ReactTooltip id={`edit-tip-${exam.id}`} effect="solid"><span>Edit</span></ReactTooltip>
                          <ReactTooltip id={`delete-tip-${exam.id}`} effect="solid"><span>Delete</span></ReactTooltip>
                          <ReactTooltip id={`duplicate-tip-${exam.id}`} effect="solid"><span>Duplicate</span></ReactTooltip>
                        </td>
                      </tr>
                      {/* Expandable Quick Stats Panel */}
                      {expandedExam === exam.id && (
                        <tr key={(exam.id || exam._id || idx) + '-expanded'} className="transition-all duration-300">
                          <td colSpan="7" className="p-0">
                            <div className="overflow-hidden transition-all duration-300 py-4 px-6 opacity-100"
                                 style={{ background: darkMode ? '#1f2937' : '#f9fafb', maxHeight: 120 }}>
                              <div className="flex flex-wrap gap-8 items-center justify-start">
                                {/* Mock stats, replace with real data if available */}
                                <div className="flex items-center gap-2">
                                  <Users size={18} className="text-blue-500" />
                                  <span className="text-sm text-gray-700 dark:text-gray-200">Assigned: <span className="font-semibold">{exam.assignedStudents || 42}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BarChart3 size={18} className="text-green-500" />
                                  <span className="text-sm text-gray-700 dark:text-gray-200">Submissions: <span className="font-semibold">{exam.submissions || 30}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={18} className="text-purple-500" />
                                  <span className="text-sm text-gray-700 dark:text-gray-200">Pass Rate: <span className="font-semibold">{exam.passRate || '80%'}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BookOpen size={18} className="text-yellow-500" />
                                  <span className="text-sm text-gray-700 dark:text-gray-200">Avg. Score: <span className="font-semibold">{exam.avgScore || '75%'}</span></span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <BookOpen size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No exams found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No exams have been created yet'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/admin/exams/create"
                className="inline-block mt-4 btn-primary"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Exam
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Version History Modal */}
      {showVersionModal && versionExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowVersionModal(false)}
              aria-label="Close version history"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
              <X size={22} />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <History size={20} /> Version History
            </h3>
            <ul className="space-y-3">
              {(versionExam.versions || [{date: new Date(), summary: 'Initial version'}]).map((ver, verIdx) => (
                <li key={ver.id || ver._id || verIdx} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">{ver.summary || `Version ${verIdx+1}`}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{ver.date ? new Date(ver.date).toLocaleString() : 'Unknown date'}</div>
                  </div>
                  <button
                    onClick={() => { toast.success('Reverted to this version!'); setShowVersionModal(false) }}
                    className="ml-4 px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Revert to version ${verIdx+1}`}
                  >
                    Revert
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageExams 