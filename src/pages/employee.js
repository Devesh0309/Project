import React, { useState, useEffect } from 'react';
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
  const [editedJob, setEditedJob] = useState({
    title: job.title,
    description: job.description
  });

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
        backgroundColor: '#F5F5DC',
        padding: '30px',
        borderRadius: '15px',
        width: '500px',
        maxWidth: '90%'
      }}>
        <h2 style={{ color: '#333333', marginBottom: '20px' }}>Edit Job</h2>
        
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
            border: '1px solid #ccc',
            backgroundColor: '#FFFFFF'
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
            border: '1px solid #ccc',
            backgroundColor: '#FFFFFF',
            minHeight: '100px'
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
      status: getRandomStatus()
    }));
  };

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    
    // If no stored jobs, use default jobs
    if (storedJobs.length === 0) {
      const defaultJobs = [
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
      ];
      localStorage.setItem('jobs', JSON.stringify(defaultJobs));
      return defaultJobs;
    }
    
    return storedJobs;
  });

  const [newJob, setNewJob] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Function to generate random candidate details
  const generateCandidateDetails = (basicInfo) => ({
    ...basicInfo,
    email: `candidate${basicInfo.id}@example.com`,
    phone: `+1 (555) ${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].slice(0, Math.floor(Math.random() * 3) + 2),
    experience: `${Math.floor(Math.random() * 8) + 2} years`,
    education: 'Bachelor in Computer Science',
    currentStatus: basicInfo.status
  });

  // Function to handle status update
  const handleStatusUpdate = (newStatus) => {
    if (selectedCandidate) {
      const updatedJobs = jobs.map(job => ({
        ...job,
        candidateList: job.candidateList.map(candidate => 
          candidate.id === selectedCandidate.id 
            ? { ...candidate, status: newStatus }
            : candidate
        )
      }));
      setJobs(updatedJobs);
      setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    }
  };

  // Candidate Details Modal
  const CandidateModal = ({ candidate, onClose }) => {
    const details = generateCandidateDetails(candidate);
    
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
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          width: '80%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto',
          color: '#333333'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#333333' }}>Candidate Details</h2>
            <button 
              onClick={onClose}
              style={{
                padding: '5px 10px',
                backgroundColor: '#5C8999',
                color: '#F5F5DC',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#4A6F7C'
                }
              }}
            >
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ 
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#333333' }}>Personal Information</h3>
              <p><strong style={{ color: '#333333' }}>Name:</strong> {details.name}</p>
              <p><strong style={{ color: '#333333' }}>Email:</strong> {details.email}</p>
              <p><strong style={{ color: '#333333' }}>Phone:</strong> {details.phone}</p>
              <p><strong style={{ color: '#333333' }}>Experience:</strong> {details.experience}</p>
              <p><strong style={{ color: '#333333' }}>Education:</strong> {details.education}</p>
              
              <h3 style={{ color: '#333333' }}>Skills</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {details.skills.map((skill, index) => (
                  <span key={index} style={{
                    backgroundColor: '#E5E5E5',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '0.9em',
                    color: '#333333'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#333333' }}>Application Status</h3>
              <div style={{ marginBottom: '20px' }}>
                <select
                  value={details.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '5px',
                    width: '200px',
                    backgroundColor: '#E5E5E5',
                    border: '1px solid #ccc',
                    color: '#333333'
                  }}
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Assignment Given">Assignment Given</option>
                </select>
              </div>

              <h3 style={{ color: '#333333' }}>Resume Preview</h3>
              <div style={{
                border: '1px solid #ddd',
                padding: '20px',
                borderRadius: '5px',
                backgroundColor: '#E5E5E5',
                height: '200px',
                overflowY: 'auto',
                color: '#333333'
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
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          width: '80%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#333333' }}>{job.title}</h2>
            <button 
              onClick={onClose}
              style={{
                padding: '5px 10px',
                backgroundColor: '#5C8999',
                color: '#F5F5DC',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#4A6F7C'
                }
              }}
            >
              Close
            </button>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#0A1931' }}>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Resume</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Application Date</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {job.candidateList.map((candidate, index) => (
                  <TableRow 
                    key={candidate.id}
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#E5E5E5',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      color: '#333333'
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        cursor: 'pointer',
                        color: '#333333',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      {candidate.name}
                    </TableCell>
                    <TableCell>
                      <Button
                        href={candidate.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: '#1976d2',
                          '&:hover': {
                            color: '#1565c0'
                          }
                        }}
                      >
                        View Resume
                      </Button>
                    </TableCell>
                    <TableCell>{candidate.applicationDate}</TableCell>
                    <TableCell>{candidate.status}</TableCell>
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
      backgroundColor: '#0A1931',
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
          color: '#FFFFFF',
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
              border: '1px solid #FFFFFF',
              width: '200px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
              border: '1px solid #FFFFFF',
              width: '300px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              '::placeholder': { color: '#FFFFFF80' }
            }}
          />
          <button
            onClick={editingId ? handleUpdate : handleAdd}
            style={{
              padding: '10px 20px',
              backgroundColor: '#5C8999',
              color: '#F5F5DC',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: '#4A6F7C'
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
                  bgcolor: '#F5F5DC',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  color: '#333333',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)'
                  },
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom sx={{ color: '#333333' }}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#333333' }}>
                    {job.description}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: '#333333'
                    }}
                  >
                    <PeopleIcon sx={{ fontSize: 20 }} />
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
                      bgcolor: '#006400',
                      color: '#F5F5DC',
                      '&:hover': { 
                        bgcolor: '#008000',
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
                      bgcolor: '#800000',
                      color: '#F5F5DC',
                      '&:hover': { bgcolor: '#A00000' }
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleJobClick(job)}
                    sx={{
                      bgcolor: '#1976d2',
                      color: '#F5F5DC',
                      '&:hover': { 
                        bgcolor: '#1565c0',
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