import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { generateMockTasks, generateMockJobPosters } from '../utils/MockDataGenerator';
import ApplicantsModal from './ApplicantsModal';
import JobDetails from './JobDetails';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const JobBoard = (props) => {
  const { userId, viewerRole } = props;
  const [tasks, setTasks] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobApplicants, setJobApplicants] = useState({});
  const [showJobDetails, setShowJobDetails] = useState(false);

  // Variable for displaying a message when no jobs are available
  const [noJobsMessage, setNoJobsMessage] = useState('');

  // Variables for URL query for filtering params
  const [searchField, setSearchField] = useState('');
  const [locationField, setLocationField] = useState('');
  const [selectedPowers, setSelectedPowers] = useState([]);

  // Toggle for showing/hiding the filter UI  
  const [showExtraFilters, setShowExtraFilters] = useState(false);

  useEffect(() => {

    fetchJobs();
  }, [locationField, searchField, selectedPowers]);

  const fetchJobs = async () => {
    // Compose params query for filtering
    const searchQuery = encodeURIComponent(searchField);
    const locationQuery = encodeURIComponent(locationField);
    const powersQuery = selectedPowers.map(encodeURIComponent).join(',');
    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.append("search", searchQuery);
    }
    if (locationQuery) {
      queryParams.append("location", locationQuery);
    }
    if (powersQuery) {
      queryParams.append("skills", powersQuery);
    }

    // Call backend to retrieve list of jobs, 
    // sorted by status = active and lastest date,
    // filtered by title/description, location, and/or powers
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/board?${queryParams.toString()}`, {
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

      if (Array.isArray(data) && data.length > 0) {
        setTasks(data);
        const applicants = {};
        data.forEach(task => {
          applicants[task._id] = task.applicants || [];
        });
        setJobApplicants(applicants);
        setNoJobsMessage('');
      } else {
        setTasks([]);
        setNoJobsMessage('No jobs available');
      }
    } catch (error) {
      console.error('Error fetching jobs from server:', error);
      // Fallback to mock jobs when there's an error with the backend server
      const mockCreators = generateMockJobPosters(5);
      const mockTasks = generateMockTasks(mockCreators, 5)
      setTasks(mockTasks);
      setNoJobsMessage('Server unavailable. Showing mock jobs.');
    }
  };



  const handleApply = (jobId) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: 'Application Pending' }));
    console.log(`Applied to job ID: ${jobId}`);
  };

  const handleViewDetails = (jobId) => {
    setSelectedJobId(jobId);
    setShowJobDetails(true);
  };

  const handleCloseJobDetails = () => {
    setShowJobDetails(false);
    setSelectedJobId(null);
  };

  const handlePowerChange = (power) => {
    if (selectedPowers.includes(power)) {
      setSelectedPowers(selectedPowers.filter(item => item !== power));
    } else {
      setSelectedPowers([...selectedPowers, power]);
    }
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

      <Row className="mb-3">
        <Col xs={12}>
          <Button variant="primary" onClick={() => setShowExtraFilters(!showExtraFilters)}>
            {showExtraFilters ? 'Hide Filters' : 'Add Filter'}
          </Button>
        </Col>
      </Row>
      
      {showExtraFilters && (
        <>
          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Form.Group controlId="searchFilter">
                <Form.Label>Search by Keyword</Form.Label>
                <Form.Control
                  placeholder="Search..."
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group controlId="locationFilter">
                <Form.Label>Filter by Location</Form.Label>
                <Form.Control
                  placeholder="Enter location..."
                  value={locationField}
                  onChange={(e) => setLocationField(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
            <Form.Group controlId="powerFilterDropdown">
              <Form.Label>Filter by Super Power</Form.Label>
              <InputGroup>
                <Form.Select
                  multiple
                  value={selectedPowers}
                  style={{ height: '75px' }}
                  onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedPowers(options);
                  }}
                >
                  <option value="telekinesis">Telekinesis</option>
                  <option value="super strength">Super Strength</option>
                  <option value="xray vision">X-Ray Vision</option>
                </Form.Select>
                <Button variant="outline-secondary" onClick={() => setSelectedPowers([])}>
                  Clear
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button variant="secondary" onClick={fetchJobs}>
                Apply Filters
              </Button>
            </Col>
          </Row>
        </>
      )}

      <Row>
        {tasks.length === 0 && (
          <Col xs={12}>
            <div className="text-center text-muted mb-4">No jobs available</div>
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
                {viewerRole === 'Superhero' && (
                  appliedJobs[task._id] ? (
                    <Button variant="success" size="sm" disabled>
                      {appliedJobs[task._id]}
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => handleApply(task._id)}>
                      Apply
                    </Button>
                  )
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


      {showJobDetails && selectedJobId && (
        <JobDetails
          jobId={selectedJobId}
          onClose={handleCloseJobDetails}
          show={showJobDetails}
        />
      )};

      <ApplicantsModal
        show={showApplicants}
        onHide={() => setShowApplicants(false)}
        applicants={jobApplicants[selectedJobId] || []}
      />
    </Container>
  );
};

export default JobBoard;