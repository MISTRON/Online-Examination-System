import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  LogOut,
  Menu,
  X,
  BarChart3,
  BookOpen
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const ManageUsers = () => {
  // Remove mock user data and fetch real users from backend
  const [users, setUsers] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '' })
  const [adding, setAdding] = useState(false)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
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
    const main = document.getElementById('manage-users-main-touch')
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

  // Statistics
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const adminUsers = users.filter(u => u.role === 'admin').length
  const studentUsers = users.filter(u => u.role === 'student').length
  const stats = [
    { title: 'Total Users', value: totalUsers, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', icon: BarChart3 },
    { title: 'Active Users', value: activeUsers, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20', icon: UserCheck },
    { title: 'Admins', value: adminUsers, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20', icon: Users },
    { title: 'Students', value: studentUsers, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', icon: Users },
  ]

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/auth/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        toast.error('Failed to fetch users')
      }
    }
    fetchUsers()
  }, [])

  // After adding a student, refresh the user list
  const handleAddStudent = async (e) => {
    e.preventDefault()
    if (!addForm.email.endsWith('@student.com')) {
      toast.error('Email must end with @student.com')
      return
    }
    setAdding(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addForm, role: 'student' })
      })
      if (!response.ok) throw new Error('Failed to add student')
      toast.success('Student added successfully!')
      setAddForm({ name: '', email: '', password: '' })
      // Refresh user list
      const usersRes = await fetch('/api/auth/users')
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }
    } catch (err) {
      toast.error('Failed to add student')
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      const response = await fetch(`/api/auth/users/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove user');
      toast.success('User removed successfully!');
      // Refresh user list
      const usersRes = await fetch('/api/auth/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (err) {
      toast.error('Failed to remove user');
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 p-4 sm:p-8 bg-white dark:bg-gray-900 min-h-screen">
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
      <div className="flex-1" id="manage-users-main-touch">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-4"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage student and admin accounts</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className={`rounded-xl shadow-sm p-4 flex items-center gap-3 bg-gradient-to-br ${stat.bgColor} dark:from-gray-900 dark:to-gray-800`}>
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="admin">Admins</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Add Student Form */}
        <form onSubmit={handleAddStudent} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow flex flex-col gap-4 max-w-md">
          <h3 className="text-lg font-semibold">Add Student</h3>
          <input
            type="text"
            name="name"
            value={addForm.name}
            onChange={handleAddChange}
            placeholder="Name"
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="email"
            name="email"
            value={addForm.email}
            onChange={handleAddChange}
            placeholder="Email"
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            name="password"
            value={addForm.password}
            onChange={handleAddChange}
            placeholder="Password"
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            required
          />
          <button type="submit" disabled={adding} className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50">
            {adding ? 'Adding...' : 'Add Student'}
          </button>
        </form>

        {/* User List */}
        <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {users.filter(user => user.role === 'student').length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">No students found</td>
                </tr>
              ) : (
                users.filter(user => user.role === 'student').map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleRemoveUser(user._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Remove</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Sidebar Cards */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6 mt-8 lg:mt-0">
        {/* Top Performers */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {users
              .filter(user => user.role === 'student' && user.averageScore > 0)
              .sort((a, b) => b.averageScore - a.averageScore)
              .slice(0, 3)
              .map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.examsTaken} exams</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${getScoreColor(user.averageScore)}`}>
                    {user.averageScore}%
                  </span>
                </div>
              ))}
          </div>
        </div>
        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {users
              .filter(user => user.examsTaken > 0)
              .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
              .slice(0, 3)
              .map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      Joined {new Date(user.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.examsTaken}</p>
                    <p className="text-xs text-gray-500">exams</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers 