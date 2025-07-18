import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../contexts/ExamContext'
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const CreateExam = () => {
  const navigate = useNavigate()
  const { createExam } = useExam()
  const [loading, setLoading] = useState(false)
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    passingScore: 70,
    startDate: '',
    endDate: '',
    questions: []
  })

  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  const addQuestion = () => {
    const newQuestion = {
      id: generateId(),
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 5
    }
    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const removeQuestion = (index) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const updateQuestion = (index, field, value) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
          : q
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (examData.questions.length === 0) {
      toast.error('Please add at least one question')
      return
    }

    // Ensure all questions have an id
    const questionsWithId = examData.questions.map(q => q.id ? q : { ...q, id: generateId() });

    setLoading(true)
    try {
      const createdExam = await createExam({
        ...examData,
        questions: questionsWithId,
        totalQuestions: questionsWithId.length
      })
      console.log('Created exam:', createdExam);
      navigate(`/admin/exams/edit/${createdExam._id}`)
    } catch (error) {
      toast.error('Failed to create exam')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
          <p className="text-gray-600">Design and configure a new examination</p>
        </div>
        <button
          onClick={() => navigate('/admin/exams')}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Exams
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Exam Title</label>
              <input
                type="text"
                required
                value={examData.title}
                onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="Enter exam title"
              />
            </div>
            <div>
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                required
                min="1"
                value={examData.duration}
                onChange={(e) => setExamData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                required
                value={examData.description}
                onChange={(e) => setExamData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field"
                rows="3"
                placeholder="Enter exam description"
              />
            </div>
            <div>
              <label className="form-label">Passing Score (%)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={examData.passingScore}
                onChange={(e) => setExamData(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="datetime-local"
                required
                value={examData.startDate}
                onChange={(e) => setExamData(prev => ({ ...prev, startDate: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="datetime-local"
                required
                value={examData.endDate}
                onChange={(e) => setExamData(prev => ({ ...prev, endDate: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn-primary"
            >
              <Plus size={16} className="mr-2" />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            {examData.questions.map((question, index) => (
              <div key={question._id || question.id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="form-label">Question Type</label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                      className="input-field"
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True/False</option>
                      <option value="essay">Essay</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Points</label>
                    <input
                      type="number"
                      min="1"
                      value={question.points}
                      onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  {question.type === 'multiple_choice' && (
                    <div>
                      <label className="form-label">Correct Answer</label>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(index, 'correctAnswer', parseInt(e.target.value))}
                        className="input-field"
                      >
                        {question.options.map((_, i) => (
                          <option key={i} value={i}>Option {i + 1}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {question.type === 'true_false' && (
                    <div>
                      <label className="form-label">Correct Answer</label>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value === 'true')}
                        className="input-field"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Question Text</label>
                  <textarea
                    required
                    value={question.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    className="input-field"
                    rows="2"
                    placeholder="Enter your question"
                  />
                </div>

                {question.type === 'multiple_choice' && (
                  <div>
                    <label className="form-label">Options</label>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <input
                          key={optionIndex}
                          type="text"
                          required
                          value={option}
                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          className="input-field"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {examData.questions.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No questions added yet</p>
                <p className="text-sm text-gray-400">Click "Add Question" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/exams')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || examData.questions.length === 0}
            className="btn-primary"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Create Exam
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateExam 