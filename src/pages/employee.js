import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Grid, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, PeopleAlt as PeopleIcon } from '@mui/icons-material';

// Add these CSS keyframes at the top of your component
const fadeIn = {
  opacity: 0,
  animation: 'fadeIn 0.5s ease-in forwards'
};

const EditModal = ({ job, onClose, onUpdate }) => {
  const [editedJob, setEditedJob] = useState(job);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#2D3748',
        padding: '30px',
        borderRadius: '15px',
        width: '500px',
        maxWidth: '90%'
      }}>
        <h2 style={{ color: '#FFFFFF', marginBottom: '20px' }}>Edit Job</h2>
        
        <input
          type="text"
          value={editedJob.title}
          onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })}
          placeholder="Job Title"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '5px',
            border: '1px solid #4B5563',
            backgroundColor: '#374151',
            color: '#FFFFFF'
          }}
        />
        
        <textarea
          value={editedJob.description}
          onChange={(e) => setEditedJob({ ...editedJob, description: e.target.value })}
          placeholder="Job Description"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #4B5563',
            backgroundColor: '#374151',
            minHeight: '100px',
            color: '#FFFFFF'
          }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#800000',
              color: '#F5F5DC',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(editedJob)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#006400',
              color: '#F5F5DC',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const Employee = () => {
  const navigate = useNavigate();

  // Add this useEffect at the top of your component
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this runs once when component mounts

  // Function to generate random date within last 30 days
  const getRandomDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return date.toLocaleDateString();
  };

  // Function to generate random status
  const getRandomStatus = () => {
    const statuses = ['Under Review', 'Interview Scheduled', 'Assignment Given'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Function to generate random candidates
  const generateCandidates = (count) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `Candidate ${index + 1}`,
      resumeLink: `https://resume.com/candidate${index + 1}`,
      applicationDate: getRandomDate(),
      status: getRandomStatus(),
      email: `candidate${index + 1}@example.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].slice(0, Math.floor(Math.random() * 3) + 2),
      experience: `${Math.floor(Math.random() * 8) + 2} years`,
      education: 'Bachelor in Computer Science'
    }));
  };

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useLocalStorage('jobs', [
    { 
      id: 1, 
      title: 'Software Engineer', 
      description: 'Full Stack Developer with React experience', 
      candidates: 14,
      candidateList: generateCandidates(14)
    },
    { 
      id: 2, 
      title: 'Product Manager', 
      description: 'Lead product development and strategy', 
      candidates: 8,
      candidateList: generateCandidates(8)
    },
    { 
      id: 3, 
      title: 'UX/UI Designer', 
      description: 'Design intuitive user interfaces and experiences', 
      candidates: 10,
      candidateList: generateCandidates(10)
    }
  ]);

  const [newJob, setNewJob] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleStatusUpdate = (candidateId, newStatus) => {
    setJobs(prevJobs => {
      const updatedJobs = prevJobs.map(job => {
        if (job.id === selectedJob.id) {
          return {
            ...job,
            candidateList: job.candidateList.map(candidate => {
              if (candidate.id === candidateId) {
                return {
                  ...candidate,
                  status: newStatus
                };
              }
              return candidate;
            })
          };
        }
        return job;
      });
      
      // Update localStorage
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      return updatedJobs;
    });

    // Update selectedJob to reflect changes immediately in the table
    setSelectedJob(prev => ({
      ...prev,
      candidateList: prev.candidateList.map(candidate => {
        if (candidate.id === candidateId) {
          return {
            ...candidate,
            status: newStatus
          };
        }
        return candidate;
      })
    }));

    // Update selectedCandidate to reflect changes in the modal
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate(prev => ({
        ...prev,
        status: newStatus
      }));
    }
  };

  // Candidate Details Modal
  const CandidateModal = ({ candidate, onClose, onStatusUpdate }) => {
    const [status, setStatus] = useState(candidate?.status || 'Under Review');

    const handleStatusChange = (newStatus) => {
      setStatus(newStatus);
      onStatusUpdate(candidate.id, newStatus);
    };

    if (!candidate) {
      return null;
    }

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#2D3748',
          padding: '30px',
          borderRadius: '10px',
          width: '80%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#FFFFFF' }}>Candidate Details</h2>
            <button 
              onClick={onClose}
              style={{
                padding: '5px 10px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Personal Information Section */}
            <div style={{ 
              backgroundColor: '#374151',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#FFFFFF', marginBottom: '15px' }}>Personal Information</h3>
              <div style={{ color: '#FFFFFF' }}>
                <p style={{ marginBottom: '10px' }}><strong>Name:</strong> {candidate.name}</p>
                <p style={{ marginBottom: '10px' }}><strong>Email:</strong> {candidate.email}</p>
                <p style={{ marginBottom: '10px' }}><strong>Phone:</strong> {candidate.phone}</p>
                <p style={{ marginBottom: '10px' }}><strong>Experience:</strong> {candidate.experience}</p>
                <p style={{ marginBottom: '15px' }}><strong>Education:</strong> {candidate.education}</p>
              </div>
              
              <h3 style={{ color: '#FFFFFF', marginBottom: '15px', marginTop: '20px' }}>Skills</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {(candidate.skills || []).map((skill, index) => (
                  <span key={index} style={{
                    backgroundColor: '#3B82F6',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '0.9em',
                    color: '#FFFFFF'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Application Status Section */}
            <div style={{ 
              backgroundColor: '#374151',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#FFFFFF', marginBottom: '15px' }}>Application Status</h3>
              <div style={{ marginBottom: '20px' }}>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '5px',
                    width: '200px',
                    backgroundColor: '#2D3748',
                    border: '1px solid #4B5563',
                    color: '#FFFFFF'
                  }}
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Assignment Given">Assignment Given</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '15px' }}>Resume Preview</h3>
              <div style={{
                border: '1px solid #4B5563',
                padding: '20px',
                borderRadius: '5px',
                backgroundColor: '#2D3748',
                height: '200px',
                overflowY: 'auto',
                color: '#FFFFFF'
              }}>
                <p>Resume preview would be displayed here.</p>
                <p>For actual implementation, you would need to integrate with a document viewer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle job click
  const handleJobClick = (job) => {
    setSelectedJob(selectedJob?.id === job.id ? null : job);
  };

  // Add new job
  const handleAdd = () => {
    if (newJob.title && newJob.description) {
      const newJobWithMeta = { 
        id: Date.now(), 
        ...newJob, 
        candidates: 0,
        candidateList: [],
        isRecent: true,
        dateAdded: new Date().toISOString()
      };
      
      const updatedJobs = [...jobs, newJobWithMeta];
      setJobs(updatedJobs);
      
      // Update localStorage and dispatch event
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      window.dispatchEvent(new Event('storage'));
      
      setNewJob({ title: '', description: '' });
    }
  };

  // Delete job
  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };
  // Start editing job
  const startEditing = (job) => {
    setEditingId(job.id);
    setNewJob({ title: job.title, description: job.description });
  };

  // Save edits with new random candidates
  const handleUpdate = (updatedDetails) => {
    setJobs(jobs.map(job => 
      job.id === editingJob.id 
        ? { 
            ...job,
            title: updatedDetails.title,
            description: updatedDetails.description
          } 
        : job
    ));
    setEditingJob(null);
  };

  // Add a cleanup effect to remove the "recent" flag after 24 hours
  useEffect(() => {
    const cleanup = setInterval(() => {
      const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);

      const updatedJobs = storedJobs.map(job => ({
        ...job,
        isRecent: job.isRecent && new Date(job.dateAdded) > dayAgo
      }));

      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      setJobs(updatedJobs);
    }, 3600000); // Check every hour

    return () => clearInterval(cleanup);
  }, []);

  // Update localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const [animate, setAnimate] = useState({
    header: false,
    form: false,
    table: false,
    button: false
  });

  // Add animation trigger effect
  useEffect(() => {
    // Stagger the animations
    setTimeout(() => setAnimate(prev => ({ ...prev, header: true })), 100);
    setTimeout(() => setAnimate(prev => ({ ...prev, form: true })), 300);
    setTimeout(() => setAnimate(prev => ({ ...prev, table: true })), 500);
    setTimeout(() => setAnimate(prev => ({ ...prev, button: true })), 700);
  }, []);

  // Add this new Modal component
  const JobModal = ({ job, onClose }) => {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#1A202C',
          padding: '30px',
          borderRadius: '10px',
          width: '80%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#FFFFFF' }}>{job.title}</h2>
            <button 
              onClick={onClose}
              style={{
                padding: '5px 10px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>

          <TableContainer 
            component={Paper} 
            sx={{
              backgroundColor: '#2D3748',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: '8px',
              '& .MuiTable-root': {
                backgroundColor: 'transparent'
              },
              '& .MuiTableCell-root': {
                borderColor: '#4A5568'
              }
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: '#374151'
                }}>
                  <TableCell sx={{ 
                    color: '#FFFFFF', 
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    padding: '16px',
                    textAlign: 'center',
                    width: '25%'
                  }}>Name</TableCell>
                  <TableCell sx={{ 
                    color: '#FFFFFF', 
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    padding: '16px',
                    textAlign: 'center',
                    width: '25%'
                  }}>Resume</TableCell>
                  <TableCell sx={{ 
                    color: '#FFFFFF', 
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    padding: '16px',
                    textAlign: 'center',
                    width: '25%'
                  }}>Application Date</TableCell>
                  <TableCell sx={{ 
                    color: '#FFFFFF', 
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    padding: '16px',
                    textAlign: 'center',
                    width: '25%'
                  }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {job.candidateList.map((candidate, index) => (
                  <TableRow 
                    key={candidate.id}
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? '#2D3748' : '#374151',
                      '&:hover': { 
                        backgroundColor: '#4A5568',
                        cursor: 'pointer' 
                      }
                    }}
                  >
                    <TableCell 
                      onClick={() => setSelectedCandidate(candidate)}
                      sx={{
                        color: '#FFFFFF',
                        borderColor: '#4A5568',
                        padding: '16px',
                        textAlign: 'center'
                      }}
                    >
                      {candidate.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#FFFFFF',
                        borderColor: '#4A5568',
                        padding: '16px',
                        textAlign: 'center'
                      }}
                    >
                      <Button
                        href={candidate.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: '#60A5FA',
                          '&:hover': {
                            color: '#93C5FD',
                            backgroundColor: 'rgba(96, 165, 250, 0.1)'
                          },
                          textTransform: 'none',
                          fontWeight: 'medium',
                          minWidth: '120px'
                        }}
                      >
                        View Resume
                      </Button>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#FFFFFF',
                        borderColor: '#4A5568',
                        padding: '16px',
                        textAlign: 'center'
                      }}
                    >
                      {candidate.applicationDate}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#FFFFFF',
                        borderColor: '#4A5568',
                        padding: '16px',
                        textAlign: 'center'
                      }}
                    >
                      {candidate.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  };

  const [editingJob, setEditingJob] = useState(null);

  // Update handleEdit function
  const handleEdit = (job) => {
    setEditingJob(job);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1A1F2B',
      minHeight: '100vh',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '90%',
        paddingTop: '40px',
        paddingBottom: '40px'
      }}>
        {/* Header with animation */}
        <h1 style={{
          textAlign: 'center',
          color: '#F3F4F6',
          marginBottom: '40px',
          ...(animate.header ? fadeIn : { opacity: 0 }),
        }}>
          JOB POSTINGS MANAGEMENT
        </h1>

        {/* Form with animation */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          ...(animate.form ? fadeIn : { opacity: 0 }),
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(-20px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #4B5563',
              width: '200px',
              backgroundColor: '#374151',
              color: '#FFFFFF',
              '::placeholder': { color: '#FFFFFF80' }
            }}
          />
          <input
            type="text"
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #4B5563',
              width: '300px',
              backgroundColor: '#374151',
              color: '#FFFFFF',
              '::placeholder': { color: '#FFFFFF80' }
            }}
          />
          <button
            onClick={editingId ? handleUpdate : handleAdd}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: '#2563EB'
              }
            }}
          >
            {editingId ? 'Update Job' : 'Add Job'}
          </button>
        </div>

        {/* Cards with animation */}
        <Grid container spacing={3} sx={{ 
          mt: 2,
          ...(animate.table ? fadeIn : { opacity: 0 })
        }}>
          {jobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={4} key={job.id} sx={{
              animation: `fadeIn 0.5s ease-in forwards ${index * 0.1}s`,
              opacity: 0
            }}>
              <Card 
                sx={{ 
                  bgcolor: '#0A2E3C',
                  color: '#FFFFFF',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  },
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '15px',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                    pointerEvents: 'none'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom sx={{ color: '#FFFFFF' }}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#FFFFFF' }}>
                    {job.description}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: '#FFFFFF'
                    }}
                  >
                    <PeopleIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                    Candidates Applied: {job.candidates}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(job);
                    }}
                    sx={{
                      bgcolor: '#4A6670',
                      color: '#FFFFFF',
                      borderRadius: '50px',
                      padding: '8px 16px',
                      '&:hover': { 
                        bgcolor: '#5A7680',
                        transition: 'background-color 0.3s'
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(job.id);
                    }}
                    sx={{
                      bgcolor: '#8B4543',
                      color: '#FFFFFF',
                      borderRadius: '50px',
                      padding: '8px 16px',
                      '&:hover': { bgcolor: '#9B5553' }
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleJobClick(job)}
                    sx={{
                      bgcolor: '#3D5A80',
                      color: '#FFFFFF',
                      borderRadius: '50px',
                      padding: '8px 16px',
                      '&:hover': { 
                        bgcolor: '#4D6A90',
                        transition: 'background-color 0.3s'
                      },
                      minWidth: '100px'
                    }}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Job Modal */}
        {selectedJob && (
          <JobModal 
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}

        {/* Candidate Modal */}
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        {/* Navigation Buttons Container */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '20px',
          marginTop: '40px',
          ...(animate.button ? fadeIn : { opacity: 0 })
        }}>
          {/* Home Button */}
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#5C8999',
              color: '#F5F5DC',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              width: '150px',
              '&:hover': {
                backgroundColor: '#4A6F7C'
              }
            }}
          >
            Home
          </button>

          {/* Create Assessment Button */}
          <button
            onClick={() => navigate('/assessment')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#5C8999',
              color: '#F5F5DC',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              width: '150px',
              '&:hover': {
                backgroundColor: '#4A6F7C'
              }
            }}
          >
            Create Assessment
          </button>
        </div>

        {/* Add EditModal */}
        {editingJob && (
          <EditModal
            job={editingJob}
            onClose={() => setEditingJob(null)}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

// Add this style to your document's <head> or CSS file
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

export default Employee;
