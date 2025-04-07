import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from "react-router";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserProfile from './UserProfile';

const DisplayApplicantProfile = (props) => {
   const {currentId} = props
   const [isUserFave, setIsUserFave] = useState(null)
   const [displayedUserId, setDisplayedUserId] = useState(useParams().id)
   const nav = useNavigate()
   
   useEffect(() => {
      if (isUserFave == null) {
         if (currentId && displayedUserId) fetchIsFave()
      } else setIsUserFave(null)
   },[currentId, displayedUserId])

   const fetchIsFave = () => {
      const url = `http://localhost:5000/api/users/${currentId}`
         fetch(url)
         .then(res=>res.json()).then(data => setIsUserFave(() => data.favourites.includes(displayedUserId)))
   }

   // const displayedUserId = useParams().id
   
   return (
      <>
         <Container fluid className='p-2 return-outer d-flex justify-content-center'>
            <Row className='p-2 return-inner flex-grow-1'>
               <Col>
                  <p style={{margin:0}} onClick={() => nav(-1)}>&larr; Go Back</p>
               </Col>
            </Row>
         </Container>
         <Container className='p-2'>
            <Row className='p-2'>
               <Col xs={12}>
                  <UserProfile userId={displayedUserId} currentId={currentId} isUserFave={isUserFave} setDisplayedUserId={setDisplayedUserId} />
               </Col>
            </Row>
         </Container>
      </>
   )
};

export default DisplayApplicantProfile;

