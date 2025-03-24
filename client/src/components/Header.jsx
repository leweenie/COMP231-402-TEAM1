import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Header = () => {
  return (
   <Container className='p-2 banner'>
      <Row className='p-2'>
         <Col xs={12} md={6} className='p-2 image'><a href="/" ><img src='/src/assets/HeroForHire_banner.png' /></a></Col>
         <Col xs={12} md={6} className='p-2 title'><h1>A <em>Super</em> Hero Can Solve<br/>Your <em>Super</em> Problems</h1></Col>
      </Row>
    </Container>
  );
}
export default Header