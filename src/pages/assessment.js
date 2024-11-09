import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import AddQuestion from '../components/AddQuestion';
import SavedAssignments from '../components/SavedAssignments';

const Assessment = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState('');
  const [animate, setAnimate] = useState(false);
  const [showError, setShowError] = useState(false);
  const [jobs] = useLocalStorage('jobs', [
    { id: 1, title: 'Software Engineer', isRecent: true },
    { id: 2, title: 'Product Manager', isRecent: false }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessmentId, setEditingAssessmentId] = useState(null);
  const [assessments, setAssessments] = useLocalStorage('assessments', {});
  const [showSavedAssignments, setShowSavedAssignments] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleActionClick = (action) => {
    if (!selectedJob) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (action === 'new') {
      setEditingAssessmentId(null);
      setIsModalOpen(true);
    } else if (action === 'saved') {
      setShowSavedAssignments(true);
    }
  };

  const handleSaveAssessment = (questions) => {
    const newAssessments = { ...assessments };
    if (!newAssessments[selectedJob]) {
      newAssessments[selectedJob] = [];
    }

    if (editingAssessmentId !== null) {
      newAssessments[selectedJob] = newAssessments[selectedJob].map(assessment =>
        assessment.id === editingAssessmentId
          ? { ...assessment, questions }
          : assessment
      );
    } else {
      newAssessments[selectedJob].push({
        id: Date.now(),
        questions,
        createdAt: new Date().toISOString()
      });
    }

    setAssessments(newAssessments);
    setIsModalOpen(false);
    setEditingAssessmentId(null);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1A1F2B',
      minHeight: '100vh',
      position: 'relative'
    }}>
      
      <button
        onClick={() => navigate('/employee')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '12px 24px',
          backgroundColor: '#5C8999',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.1rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#4A6F7C',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        Create Job
      </button>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          backgroundColor: '#0A2E3C',
          padding: '40px',
          borderRadius: '15px',
          width: '600px',
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.6s ease-in-out',
          boxShadow: `
            0 4px 6px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.08),
            0 10px 20px rgba(0, 0, 0, 0.15),
            0 3px 6px rgba(255, 255, 255, 0.05) inset
          `,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Header */}
          <div style={{
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              color: '#FFFFFF',
              fontSize: '2.5rem',
              marginBottom: '10px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Assessment Setup
            </h1>
            <p style={{
              color: '#FFFFFF',
              fontSize: '1.1rem',
              opacity: 0.8
            }}>
              Select a job position to begin
            </p>
          </div>

          {/* Error Message */}
          {showError && (
            <div style={{
              color: '#FF4444',
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '1rem',
              fontWeight: 'bold',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              Please select a job position first
            </div>
          )}

          {/* Job Selection Dropdown */}
          <div style={{
            marginBottom: '30px'
          }}>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#374151',
                color: '#FFFFFF',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                fontSize: '1.1rem',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <option value="">Select a job position</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => handleActionClick('new')}
              style={{
                padding: '12px 24px',
                backgroundColor: selectedJob ? '#4CAF50' : '#4A5568',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedJob ? 'pointer' : 'not-allowed',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                if (selectedJob) {
                  e.currentTarget.style.backgroundColor = '#45a049';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedJob) {
                  e.currentTarget.style.backgroundColor = '#4CAF50';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <AddCircleOutlineIcon style={{ fontSize: '1.2rem' }} />
              New Assignment
            </button>
            <button
              onClick={() => handleActionClick('saved')}
              style={{
                padding: '12px 24px',
                backgroundColor: selectedJob ? '#5C8999' : '#4A5568',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedJob ? 'pointer' : 'not-allowed',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                if (selectedJob) {
                  e.currentTarget.style.backgroundColor = '#4A6F7C';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedJob) {
                  e.currentTarget.style.backgroundColor = '#5C8999';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <SaveIcon style={{ fontSize: '1.2rem' }} />
              Saved Assignments
            </button>
          </div>
        </div>
      </div>

      <AddQuestion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAssessment}
        editingAssessmentId={editingAssessmentId}
        initialQuestions={editingAssessmentId 
          ? assessments[selectedJob]?.find(a => a.id === editingAssessmentId)?.questions || []
          : []
        }
      />

      <SavedAssignments
        isOpen={showSavedAssignments}
        onClose={() => setShowSavedAssignments(false)}
        assignments={assessments[selectedJob] || []}
      />
    </div>
  );
};


const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default Assessment;