import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/exams/${id}`);
        if (!res.ok) throw new Error('Failed to fetch exam');
        const data = await res.json();
        setExam(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExam(prev => ({ ...prev, [name]: value }));
  };

  // Add question editing handlers
  const handleQuestionChange = (idx, field, value) => {
    setExam(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === idx ? { ...q, [field]: value } : q)
    }))
  }
  const handleOptionChange = (qIdx, optIdx, value) => {
    setExam(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === qIdx ? { ...q, options: q.options.map((opt, oi) => oi === optIdx ? value : opt) } : q)
    }))
  }
  const handleAddOption = (qIdx) => {
    setExam(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === qIdx ? { ...q, options: [...(q.options || []), ''] } : q)
    }))
  }
  const handleRemoveOption = (qIdx, optIdx) => {
    setExam(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === qIdx ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) } : q)
    }))
  }
  const handleAddQuestion = () => {
    setExam(prev => ({
      ...prev,
      questions: [...(prev.questions || []), { id: generateId(), type: 'multiple_choice', question: '', options: [''], correctAnswer: '', points: 1 }]
    }))
  }
  const handleRemoveQuestion = (idx) => {
    setExam(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Ensure all questions have an id
      const questionsWithId = (exam.questions || []).map(q => q.id ? q : { ...q, id: generateId() });
      const updatedExam = { ...exam, questions: questionsWithId };
      const res = await fetch(`/api/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedExam)
      });
      if (!res.ok) throw new Error('Failed to update exam');
      navigate('/admin/exams');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!exam) return <div className="p-8 text-center">Exam not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Exam</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input type="text" name="title" value={exam.title || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea name="description" value={exam.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Duration (minutes)</label>
          <input type="number" name="duration" value={exam.duration || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Total Questions</label>
          <input type="number" name="totalQuestions" value={exam.totalQuestions || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Passing Score</label>
          <input type="number" name="passingScore" value={exam.passingScore || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input type="datetime-local" name="startDate" value={exam.startDate ? new Date(exam.startDate).toISOString().slice(0,16) : ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input type="datetime-local" name="endDate" value={exam.endDate ? new Date(exam.endDate).toISOString().slice(0,16) : ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        {/* Questions Editing Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Questions</h2>
          {(exam.questions || []).map((q, idx) => (
            <div key={idx} className="border rounded p-4 mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Question {idx + 1}</span>
                <button type="button" className="text-red-500 text-xs" onClick={() => handleRemoveQuestion(idx)}>Delete</button>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={q.type} onChange={e => handleQuestionChange(idx, 'type', e.target.value)} className="w-full border rounded px-2 py-1">
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="essay">Essay</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Question</label>
                <input type="text" value={q.question} onChange={e => handleQuestionChange(idx, 'question', e.target.value)} className="w-full border rounded px-2 py-1" />
              </div>
              {q.type === 'multiple_choice' && (
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Options</label>
                  {(q.options || []).map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center mb-1">
                      <input type="text" value={opt} onChange={e => handleOptionChange(idx, optIdx, e.target.value)} className="flex-1 border rounded px-2 py-1 mr-2" />
                      <button type="button" className="text-red-400" onClick={() => handleRemoveOption(idx, optIdx)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="text-primary text-xs mt-1" onClick={() => handleAddOption(idx)}>Add Option</button>
                </div>
              )}
              {q.type === 'true_false' && (
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Correct Answer</label>
                  <select value={q.correctAnswer} onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value === 'true')} className="w-full border rounded px-2 py-1">
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              )}
              {q.type === 'multiple_choice' && (
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Correct Option (index)</label>
                  <input type="number" min="0" max={(q.options || []).length - 1} value={q.correctAnswer} onChange={e => handleQuestionChange(idx, 'correctAnswer', Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                </div>
              )}
              {q.type === 'essay' && (
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Sample Answer (optional)</label>
                  <textarea value={q.correctAnswer || ''} onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value)} className="w-full border rounded px-2 py-1" />
                </div>
              )}
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Points</label>
                <input type="number" min="1" value={q.points || 1} onChange={e => handleQuestionChange(idx, 'points', Number(e.target.value))} className="w-full border rounded px-2 py-1" />
              </div>
            </div>
          ))}
          <button type="button" className="btn-secondary mt-2" onClick={handleAddQuestion}>Add Question</button>
        </div>
        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <Link to="/admin/exams" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default EditExam; 