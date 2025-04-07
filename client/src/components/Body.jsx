import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router';

const Body = (props) => {

  const {setUserName} = props
  const nav = useNavigate()

  const selectUser = (userType) => {
    setUserName(userType)
    nav(`/dashboard`)
  }

  return (
   <Container className='p-2'>
      <Row className='p-2'>
         <Col xs={12} sm={6} className='p-2'>
          <Card style={{ width: '18rem' }}>
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body>
              <Card.Title>Login As Job Poster</Card.Title>
              <Card.Text>
                View Hero for Hire with the functionalities provided a non-superhero user
              </Card.Text>
              <Button onClick={() => selectUser('Job Poster')} variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
         </Col>
         <Col xs={12} sm={6} className='p-2'>
         <Card style={{ width: '18rem' }}>
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body>
              <Card.Title>Login As Superhero</Card.Title>
              <Card.Text>
                View Hero for Hire with the functionalities provided a non-superhero user
              </Card.Text>
              <Button onClick={() => selectUser('Superhero')}  variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
         </Col>
      </Row>
    </Container>
  );
}
export default Body