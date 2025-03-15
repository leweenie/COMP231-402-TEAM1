import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const JobBoard = () => {

  const tasks = [
    {
      id: 1,
      title: 'Alien Invasion Defense',
      creator: 'United Nations',
      location: 'Worldwide',
      price: 50000,
      status: 'active',
      thumbnail: '',
      description: 'Seeking superheroes to defend Earth from an approaching alien mothership. Experience preferred.',
      postedDate: '2025-03-14'
    },
    {
      id: 2,
      title: 'Super Speed Courier Needed',
      creator: 'Daily Planet',
      location: 'Central City',
      price: 300,
      status: 'active',
      thumbnail: '',
      description: 'Urgent documents need to be delivered across the world in under 5 minutes. Speedsters apply now!',
      postedDate: '2025-03-12'
    },
    {
      id: 3,
      title: 'Super Strength Moving Help',
      creator: 'Lois Lane',
      location: 'Metropolis',
      price: 600,
      status: 'active',
      thumbnail: '',
      description: 'Moving Batmobiles into storage. Must be able to lift heavy vehicles effortlessly.',
      postedDate: '2025-03-10'
    },
    {
      id: 4,
      title: 'Underwater Rescue Mission',
      creator: 'Atlantis Marine Research',
      location: 'Atlantic Ocean',
      price: 4000,
      status: 'active',
      thumbnail: '',
      description: 'A submarine is trapped! Need aquatic heroes comfortable working at extreme depths.',
      postedDate: '2025-03-14'
    },
    {
      id: 5,
      title: 'Time Travel Consultant',
      creator: 'Temporal Affairs Bureau',
      location: 'Chronopolis',
      price: 13256,
      status: 'active',
      thumbnail: '',
      description: 'Prevent a paradox! Need experienced time travelers to fix a timeline glitch.',
      postedDate: '2025-03-13'
    },
  ];

  const getThumbnail = (thumbnail, title) =>
    thumbnail && thumbnail.trim() !== ''
      ? thumbnail
      : `https://dummyimage.com/100x100/97ddf7/000.jpg&text=${encodeURIComponent(title)}`;

  return (
    <Container className="p-4 temp-border">
      <h2 className="mb-4">Job Board</h2>
      <Row>
        {tasks.map((task) => (
          <Col key={task.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div className="job-card temp-border p-3 text-center">
              <img
                src={getThumbnail(task.thumbnail, task.title)}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  marginBottom: '10px',
                }}
              />
              <h5>{task.title}</h5>
              <p className="fw-bold">${task.price}</p>
              <p className="fw-bold">{task.creator}</p>
              <p className="text-muted">{task.location}</p>
              <p style={{ fontSize: '0.9rem' }}>{task.description}</p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <Button variant="primary" size="sm">
                  Apply
                </Button>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
              <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
                Posted on: {task.postedDate}
              </p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default JobBoard;