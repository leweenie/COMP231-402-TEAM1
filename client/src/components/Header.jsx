import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Header = () => {
  return (
   <Container className='p-2 temp-border'>
      <Row className='p-2 temp-border'>
         <Col className='p-2 temp-border'>Header is here</Col>
      </Row>
    </Container>
  );
}
export default Header