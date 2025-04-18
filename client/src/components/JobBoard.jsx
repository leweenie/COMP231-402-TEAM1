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
  const [createdJobs, setCreatedJobs] = useState({});
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobApplicants, setJobApplicants] = useState({});
  const [showJobDetails, setShowJobDetails] = useState(false);

  // Variable for displaying a message before fetchJobs has completed
  const [loading, setLoading] = useState(false);

  // Variable for displaying a message when not able to connect to backend
  const [fetchJobsStatusMessage, setFetchJobsStatusMessage] = useState('');

  // Variables for URL query for filtering params
  const [searchField, setSearchField] = useState('');
  const [locationField, setLocationField] = useState('');
  const [selectedPowers, setSelectedPowers] = useState([]);
  const [showExtraFilters, setShowExtraFilters] = useState(false);

  // Toggle for showing/hiding the filter UI  
  const [filtersCleared, setFiltersCleared] = useState(false);

  // Call fetchJobs upon initial render (component mount)
  useEffect(() => {
    fetchAppliedJobs();
    fetchCreatedJobs();
    fetchJobs();
  }, []);

  // Trigger a re-fetch of jobs only when filters are cleared via Clear Filters button
  useEffect(() => {
    if (filtersCleared) {
      fetchJobs();
      setFiltersCleared(false);
    }
  }, [filtersCleared]);

  const fetchJobs = async () => {
    setLoading(true);
    // Compose params query for filtering
    const searchQuery = encodeURIComponent(searchField);
    const locationQuery = encodeURIComponent(locationField);
    const powersQuery = selectedPowers.map(encodeURIComponent).join(',');
    const queryParams = new URLSearchParams();

    if (searchQuery) queryParams.append("search", searchQuery);
    if (locationQuery) queryParams.append("location", locationQuery);
    if (powersQuery) queryParams.append("skills", powersQuery);

    /* 
    Call backend to retrieve list of jobs, 
    sorted by status = active and lastest date,
    filtered by title/description, location, and/or powers 
    */
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/board?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP error - Status: ${response.status}`);

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setTasks(data);
        const applicants = {};
        data.forEach(task => {
          applicants[task._id] = task.applicants || [];
        });
        setJobApplicants(applicants);
        setFetchJobsStatusMessage('');
      } else {
        setTasks([]);
        setFetchJobsStatusMessage('No jobs available');
      }
    } catch (error) {
      console.error('Error fetching jobs from server:', error);
      // Fallback to mock jobs when there's an error with the backend server
      const mockCreators = generateMockJobPosters(5);
      const mockTasks = generateMockTasks(mockCreators, 5);
      setTasks(mockTasks);
      setFetchJobsStatusMessage('Server unavailable. Showing mock jobs.');
    } finally {
      setLoading(false);
    }
  };

  /* 
    Call backend to retrieve the list of superhero's applied jobs,
    to be used to determine application state for job board's listings
  */
  const fetchAppliedJobs = async () => {
    if (viewerRole === 'Superhero') {
      try {
        const response = await fetch(`http://localhost:5000/api/applications/status?applicantId=${userId}`);
        const applications = await response.json();
        
        // Reduce the object to just a list of job IDs
        const appliedJobsMap = applications.reduce((map, application) => {
          if (application?.task?._id) {
            map[application.task._id] = true;
          }
          return map;
        }, {});

        // Assign to appliedJobs to be used for comparison in JSX rendering for the Apply button
        setAppliedJobs(appliedJobsMap);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
      }
    }
  };

  /* 
    Call backend to retrieve the list of job poster's created jobs,
    to be used to determine which jobs were created by the job poster on the job board's listings
    and have the option to be deleted
  */
  const fetchCreatedJobs = async () => {
    if (viewerRole === 'Job Poster') {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/userjobs?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
          },
        });
        const jobs = await response.json();

        // Reduce the object to just a list of job IDs
        const createdJobsMap = jobs.reduce((map, job) => {
          if (job?._id) {
            map[job._id] = true;
          }
          return map;
        }, {});

        // Assign to createdJobs to be used for comparison in JSX rendering to show Delete button
        setCreatedJobs(createdJobsMap);
      } catch (error) {
        console.error('Error fetching jobs created by user:', error);
      }
    }
  }

  const handleApply = async (jobId, applicantId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ applicantId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setAppliedJobs(prevState => ({
        ...prevState,
        [jobId]: "application pending"
      }));

      alert("Applied succesfully!");
    } catch (error) {
      console.error("Error applying:", error.message);
      alert(error.message)
    }
  };

  const handleViewDetails = (jobId) => {
    setSelectedJobId(jobId);
    setShowJobDetails(true);
  };

  const handleCloseJobDetails = () => {
    setShowJobDetails(false);
    setSelectedJobId(null);
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Job deleted!");
        fetchJobs();
      } else {
        const errorText = await response.text();
        console.error("Delete failed:", errorText);
        alert("Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Something went wrong.");
    }
  };

  // Parse for image in job, else fallback to dummy image
  const getThumbnail = (image, title) => {
    if (image && image.trim() !== "") {
      // For locally hosted images for development work
      if (image.startsWith("/uploads")) {
        return `http://localhost:5000${image}`;
      }
      // Expected URL that connects to Imgur image link
      return image;
    }
    // If no valid image set
    return `https://dummyimage.com/100x100/97ddf7/000.jpg&text=${encodeURIComponent(title)}`;
  };

  // Reset all filter fields and trigger fetch jobs again via filtersCleared flag
  const clearFilters = () => {
    setSearchField('');
    setLocationField('');
    setSelectedPowers([]);
    setFiltersCleared(true);
  };

  return (
    <Container className="p-4">
      <h2 className="mb-4">Job Board</h2>
      <Button variant="primary" href="/create-job-post" className="mb-3">
        Create Job Post
      </Button>

      <Row className="mb-3">
        <Col xs={12}>
          {/* Toggle visibility of the filter UI. */}
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
                    <option value="Telekinesis">Telekinesis</option>
                    <option value="Super Strength">Super Strength</option>
                    <option value="X-ray Vision">X-ray Vision</option>
                    <option value="Other">Other</option>
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
              <div className="d-flex gap-4">
                <Button variant="primary" onClick={fetchJobs}>
                  Apply Filters
                </Button>
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}

      <Row>
        {loading && (
          <Col xs={12}>
            <div className="text-center text-primary mb-4">Loading jobs...</div>
          </Col>
        )}

        {!loading && fetchJobsStatusMessage && (
          <Col xs={12}>
            <div className="text-center text-muted mb-4">{fetchJobsStatusMessage}</div>
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
                alt="Job"
              />
              <h5>{task.title}</h5>
              <p className="fw-bold">{task.creator?.name}</p>
              <p className="text-muted">{task.location}</p>
              <p style={{ fontSize: '0.9rem' }}>{task.description}</p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                {/* Show Apply button only for Superhero role, and disable it if already applied. */}
                {viewerRole === 'Superhero' && (
                  <Button
                    variant={appliedJobs[task._id] ? 'success' : 'primary'}
                    size="sm"
                    disabled={appliedJobs[task._id]}
                    onClick={() => handleApply(task._id, userId)}
                  >
                    {appliedJobs[task._id] ? 'Already Applied' : 'Apply'}
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => handleViewDetails(task._id)}>
                  View Details
                </Button>
                {viewerRole === 'Job Poster' && createdJobs[task._id] && (
                  <Button variant="danger" size="sm" onClick={() => handleDelete(task._id)}>
                    Delete
                  </Button>
                )}
              </div>
              <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
              {createdJobs[task._id] ? 'You Posted On:' : 'Posted On:'} {new Date(task.postDate).toLocaleDateString()}
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
      )}

      <ApplicantsModal
        show={showApplicants}
        onHide={() => setShowApplicants(false)}
        applicants={jobApplicants[selectedJobId] || []}
      />
    </Container>
  );
};

export default JobBoard;