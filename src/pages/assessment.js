import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const Assessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState('');
  const [questions, setQuestions] = useLocalStorage('assessment-questions', []);
  const [jobs] = useLocalStorage('jobs', [
    { id: 1, title: 'Software Engineer' },
    { id: 2, title: 'Product Manager' }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  // Debug log to verify jobs are being loaded
  useEffect(() => {
    console.log('Current jobs in Assessment:', jobs);
  }, [jobs]);

  const handleAddQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.every(opt => opt !== '')) {
      setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  const handleEditQuestion = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    setCurrentQuestion(question);
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#0A1931',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '40px',
        position: 'relative',
        width: '100%'
      }}>
        <h1 style={{ 
          color: '#FFFFFF',
          fontSize: '2.5rem',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Create Assessment
        </h1>
        
        <button
          onClick={() => navigate('/employee')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#5C8999',
            color: '#F5F5DC',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            position: 'absolute',
            right: '20px',
            top: '10px',
            '&:hover': {
              backgroundColor: '#4A6F7C'
            }
          }}
        >
          Back to Jobs
        </button>

        {/* Updated Job Selection Dropdown */}
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '5px',
            width: '400px',
            fontSize: '1.1rem',
            border: '1px solid #FFFFFF',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          <option value="">Select a Job Position</option>
          
          {/* Recently Added Jobs Group */}
          {jobs.filter(job => job.isRecent).length > 0 && (
            <optgroup label="Recently Added Jobs">
              {jobs
                .filter(job => job.isRecent)
                .map(job => (
                  <option key={`recent-${job.id}`} value={job.id}>
                    {job.title}
                  </option>
                ))
              }
            </optgroup>
          )}
          
          {/* All Jobs Group */}
          <optgroup label="All Jobs">
            {jobs.map(job => (
              <option key={`all-${job.id}`} value={job.id}>
                {job.title}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {selectedJob && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Question Creation Form */}
          <div style={{
            backgroundColor: '#F5F5DC',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              marginBottom: '20px',
              color: '#333333'
            }}>
              Add New Question
            </h2>
            <div>
              <input
                type="text"
                placeholder="Enter your question here"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value
                })}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '20px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              />
              {currentQuestion.options.map((option, index) => (
                <div key={index} style={{ 
                  marginBottom: '15px', 
                  display: 'flex', 
                  gap: '10px'
                }}>
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({
                        ...currentQuestion,
                        options: newOptions
                      });
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={currentQuestion.correctAnswer === index}
                    onChange={() => setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: index
                    })}
                  />
                </div>
              ))}
              <button
                onClick={handleAddQuestion}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#5C8999',
                  color: '#F5F5DC',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px',
                  '&:hover': {
                    backgroundColor: '#4A6F7C'
                  }
                }}
              >
                Add Question
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div>
            <h2 style={{ color: '#FFFFFF' }}>Questions List</h2>
            {questions.map((question, index) => (
              <div
                key={question.id}
                style={{
                  backgroundColor: '#F5F5DC',
                  padding: '20px',
                  borderRadius: '15px',
                  marginBottom: '10px',
                  color: '#333333'
                }}
              >
                <h3>Question {index + 1}</h3>
                <p>{question.question}</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {question.options.map((option, optIndex) => (
                    <li
                      key={optIndex}
                      style={{
                        padding: '5px',
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => handleEditQuestion(question.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#006400',
                      color: '#F5F5DC',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#800000',
                      color: '#F5F5DC',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;