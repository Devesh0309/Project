import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const AddQuestion = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingAssessmentId = null,
  initialQuestions = []
}) => {
  const [questions, setQuestions] = useState(initialQuestions.length ? initialQuestions : [{
    text: '',
    options: ['', '', '', '']
  }]);

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      text: '',
      options: ['', '', '', '']
    }]);
  };

  const deleteQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value, optionIndex = null) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== index) return q;
      if (optionIndex !== null) {
        // Update specific option
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      // Update question text
      return { ...q, [field]: value };
    }));
  };

  const handleSave = () => {
    const validQuestions = questions.filter(q => 
      q.text.trim() && q.options.some(opt => opt.trim())
    );
    
    if (validQuestions.length > 0) {
      const formattedQuestions = validQuestions.map(q => ({
        ...q,
        correctAnswer: 0 // Default to first option
      }));
      
      onSave(formattedQuestions);
      
      setQuestions([{
        text: '',
        options: ['', '', '', '']
      }]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#0A2E3C',
        padding: '30px',
        borderRadius: '15px',
        width: '600px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <h2 style={{ color: '#FFFFFF' }}>
            {editingAssessmentId ? 'Edit Assessment' : 'New Assessment'}
          </h2>
          <button
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#FFFFFF', 
              cursor: 'pointer' 
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {questions.map((question, index) => (
          <div key={index} style={{
            backgroundColor: '#374151',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '90%' }}>
                <span style={{ 
                  color: '#FFFFFF', 
                  marginRight: '10px',
                  minWidth: '30px'
                }}>
                  Q{index + 1}.
                </span>
                <input
                  value={question.text}
                  onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                  placeholder="Enter question text"
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '1px solid #4B5563',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <button
                onClick={() => deleteQuestion(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FF4444',
                  cursor: 'pointer'
                }}
              >
                <DeleteIcon />
              </button>
            </div>

            <div>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} style={{ 
                  marginBottom: '8px',
                  marginLeft: '40px',
                  display: 'flex'
                }}>
                  <input
                    value={option}
                    onChange={(e) => updateQuestion(index, 'options', e.target.value, optIndex)}
                    placeholder={`Option ${optIndex + 1}`}
                    style={{
                      width: '80%',
                      padding: '6px',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      border: '1px solid #4B5563',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2B6CB0',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            marginBottom: '15px',
            cursor: 'pointer'
          }}
        >
          Add New Question
        </button>

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Save Assessment
        </button>
      </div>
    </div>
  )
};

export default AddQuestion; 