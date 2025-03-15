import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const JobBoard = () => {
  return (
    <Container className="p-4 temp-border">
      <h2 className="mb-4">Job Board</h2>
      <Row>
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <div className="job-card temp-border p-3 text-center">
            <p>No Jobs Yet</p>
          </div>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <div className="job-card temp-border p-3 text-center">
            <p>No Jobs Yet</p>
          </div>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <div className="job-card temp-border p-3 text-center">
            <p>No Jobs Yet</p>
          </div>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <div className="job-card temp-border p-3 text-center">
            <p>No Jobs Yet</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default JobBoard;