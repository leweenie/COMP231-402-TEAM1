import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Body = () => {
  return (
   <Container className='p-2 temp-border'>
      <Row className='p-2 temp-border'>
         <Col xs={12} sm={8} className='p-2 temp-border'>Body is like this - Col 1</Col>
         <Col xs={12} sm={4} className='p-2 temp-border'>Body is like this - Col 2</Col>
      </Row>
      <Row className='p-2 temp-border'>
         <Col className='p-2 temp-border'>Or like this</Col>
      </Row>
    </Container>
  );
}
export default Body