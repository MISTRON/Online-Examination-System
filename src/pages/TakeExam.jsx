import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useExam } from '../contexts/ExamContext'
import Countdown from 'react-countdown'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Save,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'upcoming':
      return 'bg-primary-100 text-primary-800'
    case 'expired':
      return 'bg-gray-100 text-gray-800'
    case 'completed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const TakeExam = () => {
  const { id } = useParams()
  console.log('TakeExam id param:', id)
  const navigate = useNavigate()
  const { getExamById, submitExam } = useExam()
  const { user } = useAuth()
  const [exam, setExam] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [userResult, setUserResult] = useState(null)

  useEffect(() => {
    let examData = getExamById(id)
    if (!examData) {
      // Fallback: fetch from backend if not found in state
      fetch(`/api/exams/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setExam(data)
            setTimeLeft(data.duration * 60 * 1000) // Convert to milliseconds
          } else {
            toast.error('Exam not found')
            navigate('/exams')
          }
        })
      // Don't return here, allow userResult fetch
    } else {
      setExam(examData)
      setTimeLeft(examData.duration * 60 * 1000) // Convert to milliseconds
    }
    // Fetch user result for this exam
    if (user && id) {
      fetch(`/api/auth/results?user=${user.id || user._id}&exam=${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.length > 0) setUserResult(data[0])
          else setUserResult(null)
        })
        .catch(() => setUserResult(null))
    }
  }, [id, getExamById, navigate, user])

  // After fetching or setting exam, compute status if not present
  useEffect(() => {
    if (exam && !exam.status) {
      const now = new Date();
      const start = exam.startDate ? new Date(exam.startDate) : null;
      const end = exam.endDate ? new Date(exam.endDate) : null;
      let status = 'active';
      if (start && now < start) status = 'upcoming';
      else if (end && now > end) status = 'expired';
      exam.status = status;
      setExam({ ...exam });
    }
  }, [exam]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitExam(exam, answers)
      navigate('/results')
    } catch (error) {
      toast.error('Failed to submit exam')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTimeUp = () => {
    toast.success('Time is up! Submitting exam automatically.')
    handleSubmit()
  }

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'multiple_choice':
        return '○'
      case 'true_false':
        return '□'
      case 'essay':
        return '✎'
      default:
        return '?'
    }
  }

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswerChange(question.id, index)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'true_false':
        return (
          <div className="space-y-3">
            {[
              { value: true, label: 'True' },
              { value: false, label: 'False' }
            ].map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={answers[question.id] === option.value}
                  onChange={() => handleAnswerChange(question.id, option.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'essay':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        )

      default:
        return <p className="text-gray-500">Question type not supported</p>
    }
  }

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const question = exam.questions[currentQuestion]
  const answeredQuestions = Object.keys(answers).length
  const totalQuestions = exam.questions.length
  const isCompletedByUser = !!userResult
  const isActive = !isCompletedByUser && exam.status === 'active'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {exam.title}
              <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(exam.status)}`}
                style={{ textTransform: 'capitalize' }}
              >
                {exam.status}
              </span>
            </h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-lg font-semibold text-red-600">
              <Clock size={20} />
              <Countdown
                date={Date.now() + timeLeft}
                onComplete={handleTimeUp}
                renderer={({ hours, minutes, seconds }) => (
                  <span>
                    {hours > 0 && `${hours}:`}{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                  </span>
                )}
              />
            </div>
            <p className="text-sm text-gray-500">Time remaining</p>
          </div>
        </div>
      </div>

      {/* Show message if not active or completed by user */}
      {(!isActive || isCompletedByUser) && (
        <div className="card bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4">
          {isCompletedByUser && <span>You have already taken this exam.</span>}
          {!isCompletedByUser && exam.status === 'upcoming' && <span>The exam is scheduled and will be available soon.</span>}
          {!isCompletedByUser && exam.status === 'expired' && <span>The exam period has ended. You can no longer take this exam.</span>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Question Navigation</h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, index) => (
                <button
                  key={q.id || q._id || index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`p-2 text-xs font-medium rounded ${
                    currentQuestion === index
                      ? 'bg-primary-600 text-white'
                      : answers[q.id] !== undefined
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{answeredQuestions}/{totalQuestions}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-900">
                  Question {currentQuestion + 1} of {totalQuestions}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                  {question.points} points
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {getQuestionTypeIcon(question.type)} {question.type.replace('_', ' ')}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>
              <fieldset disabled={!isActive} className={!isActive ? 'opacity-60' : ''}>
                {renderQuestion(question)}
              </fieldset>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="btn-primary"
                  disabled={isSubmitting || !isActive}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Submit Exam
                    </>
                  )}
                </button>

                {currentQuestion < exam.questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle size={24} className="text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Submission</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? You won't be able to make changes after submission.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary"
                disabled={isSubmitting}
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TakeExam 