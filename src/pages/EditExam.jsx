import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exam)
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
        {/* You can add editing for questions here if needed */}
        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <Link to="/admin/exams" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default EditExam; 