import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'

const universityLogo = '/src/manipallogo.png' // Local logo
const illustration = '/undraw_online-test_20lm.svg' // Local SVG illustration for online exam
const backgroundImg = '/uni-background.webp' // Yellow notebook background

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, handleGoogleLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
    } catch (error) {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={backgroundImg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      <div className="relative z-20 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-orange-100">
        {/* Left: Illustration & Marketing */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, rgba(255,183,77,0.85) 0%, rgba(255,152,0,0.85) 100%)' }}>
          <div className="mb-10">
            <img src={illustration} alt="Exam Illustration" width={300} height={220} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">Online Examination Portal</h2>
          <p className="text-lg text-stone-800 text-center mb-6">
            Made by teachers (student) who understand the the realities of the classroom
          </p>
        </div>
        {/* Right: Login Form */}
        <div className="md:w-1/2 flex flex-col justify-center p-8" style={{
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
          <div className="flex justify-center rounded-md text-gray-700 transition-all mb-2 text-base">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log('Google Login Failed')}
              width="100%"
              text="continue_with"
              theme="outline"
              size="large"
            />
          </div>
          <div className="text-center mt-2 text-white-600 text-base">
            Are you new?{' '}
            <Link to="/register" className="text-orange-600 hover:underline">Create an Account</Link>
            <div className="mt-2">
              <Link to="/teacher-login" className="text-sm text-gray-300 underline hover:no-underline">Teacher? Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 