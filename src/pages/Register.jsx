import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

const universityLogo = '/src/manipallogo.png'
const illustration = '/undraw_online-test_20lm.svg'
const backgroundImg = '/top-view-yellow-office-desk-table-with-lot-things-it.jpg'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(formData.name, formData.email, formData.password, formData.role)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('${backgroundImg}')` }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-10 z-0" />
      <div className="relative z-10 bg-white bg-opacity-80 rounded-2xl shadow-2xl flex w-full max-w-4xl overflow-hidden">
        {/* Left Section: Branding & Illustration */}
        <div className="left-section hidden md:flex flex-col justify-center items-center w-1/2 bg-white bg-opacity-40 p-10 border-r border-yellow-300 shadow-lg" style={{backdropFilter: 'blur(2px)'}}>
          <img 
            src={illustration} 
            alt="Exam Illustration" 
            className="w-48 mb-8" 
            style={{ 
              filter: 'drop-shadow(0 0 40pxrgb(241, 209, 45)) drop-shadow(0 0 10px #fff)', 
              opacity: 0.92, 
              mixBlendMode: 'multiply', 
              background: 'transparent' 
            }} 
          />
          <h2 className="text-2xl font-bold text-yellow-700 text-center mb-2">Create Your Account</h2>
          <p className="text-yellow-900 text-center mb-4">Join our examination system today!</p>
        </div>
        {/* Right Section: Register Form */}
        <div className="right-section flex-1 flex flex-col justify-center items-center p-8 relative"
             style={{
               background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 60%, rgba(255,255,255,0.32) 100%)',
               backdropFilter: 'blur(20px)',
               WebkitBackdropFilter: 'blur(20px)',
               border: '1.5px solid rgba(255,255,255,0.25)',
               boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)'
             }}>
          <div className="logo-area flex flex-col items-center mb-6">
            <img src={universityLogo} alt="Manipal University" className="h-12 mb-2" />
          </div>
          <div className="form-area w-full max-w-xs">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="input-area">
                <label className="block text-gray-800 mb-1 font-medium">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white bg-opacity-80"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="input-area">
                <label className="block text-gray-800 mb-1 font-medium">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white bg-opacity-80"
                  placeholder="Enter your email"
                />
              </div>
              <div className="input-area">
                <label className="block text-gray-800 mb-1 font-medium">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white bg-opacity-80"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin/Teacher</option>
                </select>
              </div>
              <div className="input-area">
                <label className="block text-gray-800 mb-1 font-medium">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none pr-10 bg-white bg-opacity-80"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="input-area">
                <label className="block text-gray-800 mb-1 font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none pr-10 bg-white bg-opacity-80"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition disabled:opacity-60"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              <div className="text-center mt-2 text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link to="/login" className="text-green-600 hover:underline">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register 