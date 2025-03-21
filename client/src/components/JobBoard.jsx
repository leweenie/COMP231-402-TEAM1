import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

const JobBoard = () => {
  const tasks = [
    {
      id: 1,
      Title: 'Alien Invasion Defense',
      Creator: 'United Nations',
      Location: 'Worldwide',
      price: 50000,
      status: 'active',
      thumbnail: '',
      Description: 'Seeking superheroes to defend Earth from an approaching alien mothership. Experience preferred.',
      postDate: '2025-03-14'
    },
    {
      id: 2,
      Title: 'Super Speed Courier Needed',
      Creator: 'Daily Planet',
      Location: 'Central City',
      price: 300,
      status: 'active',
      thumbnail: '',
      Description: 'Urgent documents need to be delivered across the world in under 5 minutes. Speedsters apply now!',
      postDate: '2025-03-12'
    },
    {
      id: 3,
      Title: 'Super Strength Moving Help',
      Creator: 'Lois Lane',
      Location: 'Metropolis',
      price: 600,
      status: 'active',
      thumbnail: '',
      Description: 'Moving Batmobiles into storage. Must be able to lift heavy vehicles effortlessly.',
      postDate: '2025-03-10'
    },
    {
      id: 4,
      Title: 'Underwater Rescue Mission',
      Creator: 'Atlantis Marine Research',
      Location: 'Atlantic Ocean',
      price: 4000,
      status: 'active',
      thumbnail: '',
      Description: 'A submarine is trapped! Need aquatic heroes comfortable working at extreme depths.',
      postDate: '2025-03-14'
    },
    {
      id: 5,
      Title: 'Time Travel Consultant',
      Creator: 'Temporal Affairs Bureau',
      Location: 'Chronopolis',
      price: 13256,
      status: 'active',
      thumbnail: '',
      Description: 'Prevent a paradox! Need experienced time travelers to fix a timeline glitch.',
      postDate: '2025-03-13'
    },
  ];

  const [appliedJobs, setAppliedJobs] = useState({});

  const handleApply = (jobId) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: 'Application Pending' }));
    console.log(`Applied to job ID: ${jobId}`);
  };

  const getThumbnail = (thumbnail, Title) =>
    thumbnail && thumbnail.trim() !== ''
      ? thumbnail
      : `https://dummyimage.com/100x100/97ddf7/000.jpg&text=${encodeURIComponent(Title)}`;

  return (
    <Container className="p-4 temp-border">
      <h2 className="mb-4">Job Board</h2>
      <Row>
        {tasks.map((task) => (
          <Col key={task.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div className="job-card temp-border p-3 text-center">
              <img
                src={getThumbnail(task.thumbnail, task.Title)}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  marginBottom: '10px',
                }}
              />
              <h5>{task.Title}</h5>
              <p className="fw-bold">${task.price}</p>
              <p className="fw-bold">{task.Creator}</p>
              <p className="text-muted">{task.Location}</p>
              <p style={{ fontSize: '0.9rem' }}>{task.Description}</p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                {appliedJobs[task.id] ? (
                  <Button variant="success" size="sm" disabled>
                    {appliedJobs[task.id]}
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => handleApply(task.id)}>
                    Apply
                  </Button>
                )}
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
              <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
                Posted on: {task.postDate}
              </p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default JobBoard;