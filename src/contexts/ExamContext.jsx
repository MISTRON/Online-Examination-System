import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const ExamContext = createContext()

export const useExam = () => {
  const context = useContext(ExamContext)
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider')
  }
  return context
}

export const ExamProvider = ({ children }) => {
  const [exams, setExams] = useState([])
  const [currentExam, setCurrentExam] = useState(null)
  const [examResults, setExamResults] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth();

  // Load exams from backend
  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoading(true);
        const headers = user && user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
        const response = await fetch('/api/exams', { headers });
        if (!response.ok) throw new Error('Failed to load exams');
        const data = await response.json();
        setExams(data);
      } catch (error) {
        toast.error('Failed to load exams');
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, [user]);

  const createExam = async (examData) => {
    try {
      setLoading(true);
      const headers = { 'Content-Type': 'application/json' };
      if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers,
        body: JSON.stringify(examData)
      });
      if (!response.ok) throw new Error('Failed to create exam');
      const result = await response.json();
      console.log('Create exam response:', result);
      setExams(prev => [...prev, result.exam]);
      toast.success('Exam created successfully!');
      return result.exam;
    } catch (error) {
      toast.error('Failed to create exam');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateExam = async (examId, examData) => {
    try {
      setLoading(true);
      const headers = { 'Content-Type': 'application/json' };
      if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
      const response = await fetch(`/api/exams/${examId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(examData)
      });
      if (!response.ok) throw new Error('Failed to update exam');
      const result = await response.json();
      setExams(prev => prev.map(exam => exam._id === examId || exam.id === examId ? result.exam : exam));
      toast.success('Exam updated successfully!');
      return result.exam;
    } catch (error) {
      toast.error('Failed to update exam');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (examId) => {
    if (!examId) {
      toast.error('Invalid exam ID');
      return false;
    }
    try {
      setLoading(true);
      const headers = {};
      if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
      const response = await fetch(`/api/exams/${examId}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error('Failed to delete exam');
      setExams(prev => prev.filter(exam => exam._id !== examId && exam.id !== examId));
      return true;
    } catch (error) {
      toast.error('Failed to delete exam');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getExamById = (examId) => {
    return exams.find(exam => (exam._id || exam.id) === examId || (exam._id || exam.id) === parseInt(examId));
  };

  const submitExam = async (examOrId, answers) => {
    let exam = typeof examOrId === 'object' ? examOrId : getExamById(examOrId);
    console.log('submitExam called with:', examOrId, answers);
    console.log('Current exams:', exams);
    console.log('Exam found:', exam);
    console.log('DEBUG: answers object:', answers);
    console.log('DEBUG: exam.questions:', exam.questions);
    try {
      setLoading(true)
      if (!exam) {
        console.error('Exam not found for id:', examOrId);
        throw new Error('Exam not found')
      }

      // Calculate score
      let totalScore = 0
      let earnedScore = 0

      exam.questions.forEach(question => {
        const qid = question.id || question._id;
        totalScore += question.points
        if (question.type === 'multiple_choice' || question.type === 'true_false') {
          if (answers[qid] === question.correctAnswer) {
            earnedScore += question.points
          }
        } else if (question.type === 'essay') {
          if (answers[qid] && answers[qid].trim().length > 10) {
            earnedScore += question.points * 0.8
          }
        }
      })

      const percentage = Math.round((earnedScore / totalScore) * 100)
      const passed = percentage >= exam.passingScore

      const payload = {
        user: user.id || user._id,
        exam: exam.id || exam._id,
        score: earnedScore,
        totalScore,
        percentage,
        passed,
        answers
      };
      console.log('Submitting exam result payload:', payload);

      // Save result to backend
      const response = await fetch('/api/auth/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) throw new Error('Failed to save result')
      toast.success('Exam submitted and result saved!')
      const resultData = await response.json();
      // Fetch latest results for the user
      if (user && (user.id || user._id)) {
        try {
          const res = await fetch(`/api/auth/results/user/${user.id || user._id}`);
          if (res.ok) {
            const data = await res.json();
            setExamResults(data);
          }
        } catch (e) { /* ignore */ }
      }
      return resultData;
    } catch (error) {
      toast.error('Failed to submit exam')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getExamResults = (userId = null) => {
    if (userId) {
      return examResults.filter(result => result.userId === userId)
    }
    return examResults
  }

  // Fetch all results for admin (with user info)
  const fetchAllResults = async () => {
    try {
      setLoading(true);
      const headers = user && user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
      const response = await fetch('/api/auth/results', { headers });
      if (!response.ok) throw new Error('Failed to fetch all results');
      let data = await response.json();
      // Ensure submittedAt is a Date object
      data = data.map(result => ({
        ...result,
        submittedAt: result.submittedAt ? new Date(result.submittedAt) : null
      }));
      setExamResults(data);
    } catch (error) {
      toast.error('Failed to fetch all results');
      setExamResults([]);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    exams,
    currentExam,
    examResults,
    loading,
    createExam,
    updateExam,
    deleteExam,
    getExamById,
    submitExam,
    getExamResults,
    setCurrentExam,
    fetchAllResults // <-- add to context value
  }

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  )
} 