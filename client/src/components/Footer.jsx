import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer = () => {
  return (
   <Container className='p-2 footer'>
    <Row className='p-2'>
         <Col className='p-2'>Hero For Hire &copy; 2025</Col>
      </Row>
    </Container>
  );
}
export default Footer