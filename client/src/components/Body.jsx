import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';

const Body = (props) => {
  const {setUserName} = props

  return (
   <Container className='p-2'>
      <Row className='p-2'>
         <Col xs={12} sm={6} className='p-2'>
          <Card style={{ width: '18rem' }}>
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body>
              <Card.Title>Login As Job Poster</Card.Title>
              {/* <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text> */}
              <Button onClick={() => setUserName('Job Poster')} variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
         </Col>
         <Col xs={12} sm={6} className='p-2'>
         <Card style={{ width: '18rem' }}>
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body>
              <Card.Title>Login As Superhero</Card.Title>
              {/* <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text> */}
              <Button onClick={() => setUserName('Superhero')}  variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
         </Col>
      </Row>
    </Container>
  );
}
export default Body