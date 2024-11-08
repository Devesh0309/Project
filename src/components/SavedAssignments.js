import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  Stack,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const SavedAssignments = ({ isOpen, onClose, assignments = [], onUpdateAssignment }) => {
  const [expandedAssignments, setExpandedAssignments] = React.useState({});
  const [editingQuestions, setEditingQuestions] = React.useState({});
  const [localAssignments, setLocalAssignments] = React.useState(assignments);

  React.useEffect(() => {
    setLocalAssignments(assignments);
  }, [assignments]);

  const toggleAssignment = (index) => {
    setExpandedAssignments(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleDeleteQuestion = (assessmentIndex, questionIndex) => {
    const updatedAssignment = { ...localAssignments[assessmentIndex] };
    updatedAssignment.questions = updatedAssignment.questions.filter((_, index) => index !== questionIndex);
    setLocalAssignments(prev => {
      const newAssignments = [...prev];
      newAssignments[assessmentIndex] = updatedAssignment;
      return newAssignments;
    });
  };

  const handleEditQuestion = (assessmentIndex, questionIndex, updatedText, optionIndex = null) => {
    if (typeof updatedText === 'string') {
      const updatedAssignment = { ...localAssignments[assessmentIndex] };
      
      if (optionIndex !== null) {
        // Update option text
        updatedAssignment.questions[questionIndex].options[optionIndex] = updatedText;
      } else {
        // Update question text
        updatedAssignment.questions[questionIndex].text = updatedText;
      }
      
      // Update local state first
      const newAssignments = [...localAssignments];
      newAssignments[assessmentIndex] = updatedAssignment;
      setLocalAssignments(newAssignments);
    } else {
      // Toggle edit mode
      setEditingQuestions(prev => ({
        ...prev,
        [`${assessmentIndex}-${questionIndex}`]: !prev[`${assessmentIndex}-${questionIndex}`]
      }));

      // When saving (turning off edit mode)
      if (editingQuestions[`${assessmentIndex}-${questionIndex}`] && typeof onUpdateAssignment === 'function') {
        onUpdateAssignment(assessmentIndex, localAssignments[assessmentIndex]);
      }
    }
  };

  const handleAddQuestion = (assessmentIndex) => {
    const updatedAssignment = { ...localAssignments[assessmentIndex] };
    const newQuestion = {
      text: "",
      options: ["", "", "", ""],  // Four empty options
      correctAnswer: 0
    };
    
    updatedAssignment.questions = [
      ...updatedAssignment.questions,
      newQuestion
    ];
    
    // Update local state
    const newAssignments = [...localAssignments];
    newAssignments[assessmentIndex] = updatedAssignment;
    setLocalAssignments(newAssignments);
    
    // Update parent state if handler exists
    if (typeof onUpdateAssignment === 'function') {
      onUpdateAssignment(assessmentIndex, updatedAssignment);
    }
  };

  if (!isOpen) return null;

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <Paper sx={{
        bgcolor: '#0A2E3C',
        p: 3,
        borderRadius: 2,
        width: 600,
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Typography variant="h5" color="white">Saved Assignments</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {localAssignments.length === 0 ? (
          <Typography color="white" textAlign="center">No saved assignments found.</Typography>
        ) : (
          localAssignments.map((assessment, index) => (
            <Paper key={index} sx={{
              bgcolor: '#374151',
              p: 2,
              mb: 2,
              borderRadius: 1,
              color: 'white'
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Assignment {index + 1} : #{assessment.id || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                    Created: {assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'Date not available'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleAddQuestion(index)}
                    sx={{ bgcolor: '#60A5FA' }}
                    startIcon={<AddIcon />}
                  >
                    Add Question
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => toggleAssignment(index)}
                    sx={{ bgcolor: '#60A5FA' }}
                  >
                    {expandedAssignments[index] ? 'Hide' : 'View'}
                  </Button>
                </Box>
              </Box>

              {expandedAssignments[index] && (
                <Box sx={{ mt: 2 }}>
                  {assessment.questions.map((question, qIndex) => (
                    <Paper key={qIndex} sx={{
                      bgcolor: '#2D3748',
                      p: 2,
                      mb: 2,
                      borderRadius: 1
                    }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Chip 
                            label={`Q${qIndex + 1}`}
                            sx={{ 
                              bgcolor: '#60A5FA',
                              color: 'white',
                              fontWeight: 'bold'
                            }} 
                          />
                          {editingQuestions[`${index}-${qIndex}`] ? (
                            <TextField
                              fullWidth
                              multiline
                              minRows={2}
                              value={question.text}
                              onChange={(e) => handleEditQuestion(index, qIndex, e.target.value)}
                              sx={{
                                '& .MuiInputBase-root': {
                                  color: 'white',
                                  bgcolor: '#1F2937'
                                }
                              }}
                            />
                          ) : (
                            <Paper 
                              sx={{
                                bgcolor: '#1F2937',
                                p: 2,
                                flex: 1,
                                border: '1px solid #4B5563',
                                color: 'white'
                              }}
                            >
                              <Typography>{question.text}</Typography>
                            </Paper>
                          )}
                        </Box>

                        {question.options && (
                          <Stack spacing={1} sx={{ pl: 4 }}>
                            {question.options.map((option, optIndex) => (
                              <Box key={optIndex} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Chip
                                  label={String.fromCharCode(65 + optIndex)}
                                  sx={{
                                    bgcolor: '#1F2937',
                                    color: '#9CA3AF',
                                    minWidth: 32,
                                    '& .MuiChip-label': {
                                      padding: '0 8px'
                                    }
                                  }}
                                />
                                {editingQuestions[`${index}-${qIndex}`] ? (
                                  <TextField
                                    fullWidth
                                    value={option}
                                    onChange={(e) => handleEditQuestion(index, qIndex, e.target.value, optIndex)}
                                    sx={{
                                      '& .MuiInputBase-root': {
                                        color: 'white',
                                        bgcolor: '#1F2937'
                                      },
                                      '& .MuiOutlinedInput-input': {
                                        padding: '8px 14px'
                                      }
                                    }}
                                    size="small"
                                  />
                                ) : (
                                  <Paper sx={{
                                    bgcolor: '#1F2937',
                                    p: 1,
                                    flex: 1,
                                    border: '1px solid #4B5563'
                                  }}>
                                    <Typography color="white">{option}</Typography>
                                  </Paper>
                                )}
                              </Box>
                            ))}
                          </Stack>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <IconButton
                            onClick={() => handleEditQuestion(index, qIndex)}
                            sx={{ color: '#60A5FA' }}
                          >
                            {editingQuestions[`${index}-${qIndex}`] ? (
                              <SaveIcon fontSize="small" />
                            ) : (
                              <EditIcon fontSize="small" />
                            )}
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteQuestion(index, qIndex)}
                            sx={{ color: '#EF4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default SavedAssignments; 