import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'

const universityLogo = '/src/manipallogo.png' // Local logo
const illustration = '/undraw_online-test_20lm.svg' // Local SVG illustration for online exam
const backgroundImg = '/top-view-yellow-office-desk-table-with-lot-things-it.jpg' // Yellow notebook background

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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('${backgroundImg}')` }}
    >
      {/* Optional overlay for readability */}
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
          <h2 className="text-2xl font-bold text-yellow-700 text-center mb-2">Online Examination System</h2>
          <p className="text-yellow-900 text-center mb-4">Say goodbye to paperwork — conduct exams the smarter way.</p>
        </div>
        {/* Right Section: Login Form */}
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
                <label className="block text-gray-800 mb-1 font-medium">Username or email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white bg-opacity-80"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="input-area">
                <label className="block text-gray-800 mb-1 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none pr-10 bg-white bg-opacity-80"
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
              <div className="flex justify-between items-center text-sm mb-2">
                <div></div>
                <Link to="#" className="text-green-600 hover:underline">Forgot password?</Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <div className="flex items-center my-2">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="mx-2 text-gray-400 text-xs">or</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log('Google Login Failed')}
                width="100%"
              />
              <div className="text-center mt-1 text-sm">
                <span className="text-gray-600">Are you a teacher? </span>
                <Link to="/teacher-login" className="text-blue-600 hover:underline">Login here</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 