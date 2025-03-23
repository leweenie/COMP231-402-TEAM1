import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { generateMockTasks, generateMockJobPosters } from '../utils/MockDataGenerator';
import ApplicantsModal from './ApplicantsModal';
import sampleApplicants from '../data/sampleApplicants.json';

const JobBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [noJobsMessage, setNoJobsMessage] = useState('');
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobApplicants, setJobApplicants] = useState({});

  useEffect(() => {
    const mockCreators = generateMockJobPosters(5);
    console.log(mockCreators)
    const mockTasks = generateMockTasks(mockCreators, 5)
    console.log(mockTasks)

    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs/board', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error - Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (Array.isArray(data) && data.length > 0) {
          setTasks(data);
          // Allocate random applicants to each job
          const applicants = {};
          data.forEach(task => {
            const shuffledApplicants = [...sampleApplicants.applicants]
              .sort(() => Math.random() - 0.5)
              .slice(0, Math.floor(Math.random() * 3) + 1);
            applicants[task._id] = shuffledApplicants;
          });
          setJobApplicants(applicants);
          setNoJobsMessage('');
        } else {
          console.log('No tasks found');
          setNoJobsMessage('No jobs available');
        }
      } catch (error) {
        console.error('Error fetching tasks from server:', error);
        // Fallback to mock tasks when there's an error with the backend server
        setTasks(mockTasks);
        // Allocate random applicants to mock tasks
        const applicants = {};
        mockTasks.forEach(task => {
          const shuffledApplicants = [...sampleApplicants.applicants]
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 3) + 1);
          applicants[task._id] = shuffledApplicants;
        });
        setJobApplicants(applicants);
        setNoJobsMessage('Server unavailable. Showing mock jobs.');
      }
    };

    fetchJobs();
  }, []);

  const handleApply = (jobId) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: 'Application Pending' }));
    console.log(`Applied to job ID: ${jobId}`);
  };

  const handleViewDetails = (jobId) => {
    setSelectedJobId(jobId);
    setShowApplicants(true);
  };

  // Parse for image URL, else fallback to dummy image
  const getThumbnail = (image, title) =>
    image && image.trim() !== ''
      ? image
      : `https://dummyimage.com/100x100/97ddf7/000.jpg&text=${encodeURIComponent(title)}`;

  return (
    <Container className="p-4 temp-border">
      <h2 className="mb-4">Job Board</h2>
      <Button variant="primary" href="/create-job-post" className="mb-3">
        Create Job Post
      </Button>
      <Row>
        {noJobsMessage && (
          <Col xs={12}>
            <div className="text-center text-muted mb-4">{noJobsMessage}</div>
          </Col>
        )}

        {tasks.map((task) => (
          <Col key={task._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div className="job-card temp-border p-3 text-center">
              <img
                src={getThumbnail(task.image, task.title)}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  marginBottom: '10px',
                }}
              />
              <h5>{task.title}</h5>
              <p className="fw-bold">{task.creator?.name}</p>
              <p className="text-muted">{task.location}</p>
              <p style={{ fontSize: '0.9rem' }}>{task.description}</p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                {appliedJobs[task._id] ? (
                  <Button variant="success" size="sm" disabled>
                    {appliedJobs[task._id]}
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => handleApply(task._id)}>
                    Apply
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => handleViewDetails(task._id)}>
                  View Details
                </Button>
              </div>
              <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
                Posted on: {new Date(task.postDate).toLocaleDateString()}
              </p>
            </div>
          </Col>
        ))}
      </Row>

      <ApplicantsModal
        show={showApplicants}
        onHide={() => setShowApplicants(false)}
        applicants={jobApplicants[selectedJobId] || []}
      />
    </Container>
  );
};

export default JobBoard;