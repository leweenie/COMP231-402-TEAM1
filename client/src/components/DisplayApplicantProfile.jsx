import React from 'react';
import { useParams, Link } from "react-router";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserProfile from './UserProfile';

const DisplayApplicantProfile = () => {
   const applicantId = useParams().id
   return (
      <>
         <Container fluid className='p-2 return-outer d-flex justify-content-center'>
            <Row className='p-2 return-inner flex-grow-1'>
               <Col>
                  <Link to={'/dashboard'}>&larr; Return to My Dashboard</Link>
               </Col>
            </Row>
         </Container>
         <Container className='p-2'>
            <Row className='p-2'>
               <Col xs={12}>
                  <UserProfile userId={applicantId}/>
               </Col>
            </Row>
         </Container>
      </>
   )
};

export default DisplayApplicantProfile;

