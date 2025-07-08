import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

const universityLogo = '/src/manipallogo.png' // Local logo
const illustration = '/undraw_online-test_20lm.svg' // Local SVG illustration for online exam
const backgroundImg = '/uni-background.webp' // Yellow notebook background

const TeacherLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!email.endsWith('@teacher.com') && !email.endsWith('@admin.com')) {
      setLoading(false)
      window.toast && window.toast.error ? window.toast.error('Only @teacher.com or @admin.com emails can log in here.') : alert('Only @teacher.com or @admin.com emails can log in here.')
      return
    }
    try {
      await login(email, password)
    } catch (error) {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${backgroundImg}')` }}>
      <div className="relative z-10 w-full max-w-5xl min-h-[600px] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-orange-100">
        {/* Left: Illustration & Marketing */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, rgba(255,183,77,0.85) 0%, rgba(255,152,0,0.85) 100%)', minHeight: '600px' }}>
          <div className="mb-10">
            <img src={illustration} alt="Exam Illustration" width={300} height={220} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">Teacher Login</h2>
          <p className="text-lg text-stone-800 text-center mb-6">
            Welcome, teachers! Please sign in to manage your exams and results.
          </p>
        </div>
        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8" style={{
          background: 'rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div className="flex flex-col items-center mb-6">
            <img src={universityLogo} alt="Manipal University Logo" width={220} height={48} className="mb-4" />
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-1">Username or email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 text-base text-gray-700"
                placeholder='Enter your email'
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 text-base text-gray-700 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
              </div>
            </div>
            <br />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition text-base disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-white-400">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <div className="text-center mt-2 text-white-600 text-base">
            <Link to="/login" className="text-orange-600 hover:underline">Student? Login here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherLogin 