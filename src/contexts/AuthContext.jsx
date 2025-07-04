import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import jwt_decode from 'jwt-decode'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference, default to false
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Update localStorage and document class when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const userData = await response.json()
      setUser(userData.user)
      localStorage.setItem('user', JSON.stringify(userData.user))
      toast.success('Login successful!')
      
      // Redirect based on user role
      if (userData.user.role === 'admin' || userData.user.role === 'teacher') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      toast.error('Login failed! Please check your credentials and try again.')
    }
  }

  const register = async (name, email, password, role = 'student') => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const userData = await response.json()
      setUser(userData.user)
      localStorage.setItem('user', JSON.stringify(userData.user))
      toast.success('Registration successful!')
      
      // Redirect based on user role
      if (userData.user.role === 'admin' || userData.user.role === 'teacher') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      toast.error('Registration failed! Please try again.')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleGoogleLogin = (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      // You can send credentialResponse.credential to your backend for verification in production
      const mockUser = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        role: decoded.email.includes('admin') || decoded.email.includes('teacher') ? 'admin' : 'student',
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success('Google login successful!');
      
      // Redirect based on user role
      if (mockUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    handleGoogleLogin,
    darkMode,
    toggleDarkMode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 