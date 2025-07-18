import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import { CheckCircle, XCircle } from 'lucide-react'

const ViewExam = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userResult, setUserResult] = useState(null);

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
  }, [id, user]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!exam) return <div className="p-8 text-center">Exam not found.</div>;

  // Determine if we are in feedback/review mode
  const isReviewMode = location.pathname.endsWith('/view');

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      {userResult && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
          You have already taken this exam.
        </div>
      )}
      <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">{exam.description}</p>
      <div className="mb-2"><b>Duration:</b> {exam.duration} min</div>
      <div className="mb-2"><b>Total Questions:</b> {exam.totalQuestions}</div>
      <div className="mb-2"><b>Passing Score:</b> {exam.passingScore}</div>
      <div className="mb-2"><b>Start Date:</b> {exam.startDate ? new Date(exam.startDate).toLocaleString() : 'N/A'}</div>
      <div className="mb-2"><b>End Date:</b> {exam.endDate ? new Date(exam.endDate).toLocaleString() : 'N/A'}</div>
      <h2 className="text-xl font-semibold mt-6 mb-2">Questions</h2>
      <ol className="list-decimal pl-6">
        {exam.questions && exam.questions.length > 0 ? exam.questions.map((q, idx) => {
          const qid = q.id || q._id;
          const userAnswer = userResult?.answers?.[qid];
          const isCorrect = userAnswer !== undefined && userAnswer === q.correctAnswer;
          return (
            <li key={qid || idx} className="mb-4">
              <div className="font-medium flex items-center gap-2">
                {q.question}
                {isReviewMode && userResult && (
                  isCorrect ? <CheckCircle className="inline text-green-600" size={18} /> : <XCircle className="inline text-red-600" size={18} />
                )}
              </div>
              <div className="text-sm text-gray-500 mb-1">Type: {q.type}</div>
              {q.options && q.options.length > 0 && (
                <ul className="list-disc pl-6 mb-1">
                  {q.options.map((opt, oidx) => {
                    let optClass = '';
                    if (isReviewMode && userResult) {
                      if (oidx === userAnswer && oidx === q.correctAnswer) optClass = 'bg-green-100 text-green-800 font-bold';
                      else if (oidx === userAnswer && oidx !== q.correctAnswer) optClass = 'bg-red-100 text-red-800 font-bold';
                      else if (oidx === q.correctAnswer) optClass = 'bg-green-50 text-green-700';
                    }
                    return (
                      <li key={oidx} className={optClass + ' rounded px-2 py-1'}>
                        {opt}
                        {isReviewMode && userResult && oidx === userAnswer && (
                          <span className="ml-2">(Your answer)</span>
                        )}
                        {isReviewMode && userResult && oidx === q.correctAnswer && <span className="ml-2 text-green-700">(Correct answer)</span>}
                        {isReviewMode && userResult && oidx === userAnswer && (
                          isCorrect ? <CheckCircle className="inline ml-2 text-green-600" size={16} /> : <XCircle className="inline ml-2 text-red-600" size={16} />
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              {q.type === 'true_false' && isReviewMode && userResult && (
                <div className="mb-1">
                  <span className={isCorrect ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                    Your answer: {String(userAnswer)}
                    {isCorrect ? <CheckCircle className="inline ml-2 text-green-600" size={16} /> : <XCircle className="inline ml-2 text-red-600" size={16} />}
                  </span>
                  <span className="ml-4 text-green-700">Correct answer: {String(q.correctAnswer)}</span>
                </div>
              )}
              {q.type === 'essay' && isReviewMode && userResult && (
                <div className="mb-1">
                  <span className={isCorrect ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                    Your answer: {userAnswer}
                    {isCorrect ? <CheckCircle className="inline ml-2 text-green-600" size={16} /> : <XCircle className="inline ml-2 text-red-600" size={16} />}
                  </span>
                  <span className="ml-4 text-green-700">Sample correct answer: {q.correctAnswer}</span>
                </div>
              )}
              <div className="text-xs text-gray-400">Points: {q.points}</div>
            </li>
          );
        }) : <li>No questions.</li>}
      </ol>
      <div className="mt-6">
        <Link to="/admin/exams" className="text-blue-600 hover:underline">Back to Exams</Link>
      </div>
    </div>
  );
};

export default ViewExam; 