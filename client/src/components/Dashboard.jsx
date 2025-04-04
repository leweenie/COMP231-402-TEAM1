import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/esm/Stack';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import DashApplicantModal from './DashApplicantModal';
import StarRatings from './StarRatings';
import ActiveJobDash from './ActiveJobDash'
import Notifications from './Notifications';

const Dashboard = (props) => { 
   const { userId, viewerRole } = props;
   const [tasks, setTasks] = useState([])
   const [user, setUser] = useState({})

   useEffect(() => {
      if (userId) {
         const url = `http://localhost:5000/api/users/${userId}`
         fetch(url)
         .then(res=>res.json()).then(data => setUser(data))
      }
   }, [userId])

   useEffect(() => {
      if (Object.keys(user).length) {
         const results = []
         const url = 'http://localhost:5000/api/jobs/'
         
         if (viewerRole === "Job Poster") {
            fetch(url)
            .then(res=>res.json()).then(data => data.map(el => {
               if (el.creator == user._id) results.push(el) 
            }))
            .then(() => setTasks(results))
         } else if (viewerRole === "Superhero") {
            fetch(url)
            .then(res=>res.json())
            .then(data => {
               const claimedJobs = data.filter(job => job.claimedBy === userId);
               setTasks(claimedJobs);
            })
            .catch(err => console.error("Error fetching jobs:", err))
         }
      }      
   }, [user, viewerRole, userId])

   if (user.name) {
      return (
         <Container className='p-2'>
            <Row className='p-2'>
               <Col xs={12}>
                  <Notifications viewerRole={viewerRole} />
               </Col>
            </Row>
            <Row className='p-2'>
               <Col xs={12} sm={8}>
                  <Stack className='dash-job-panel p-4' direction='vertical' gap={3}>
                     <h2>Track Active Jobs</h2>
                     <Accordion>
                        { tasks.length ? tasks.map((task, i) => 
                           <ActiveJobDash 
                              key={i} 
                              index={i} 
                              id={task._id} 
                              title={task.title} 
                              status={task.status}
                              viewerRole={viewerRole}
                              creatorId={task.creator}
                           />
                        ) : null }
                     </Accordion>
                  </Stack>
                  
               </Col>
               <Col xs={12} sm={4}>
                  <Stack className='dash-profile-panel p-4' direction='vertical' gap={3}>
                     <Image className='profile-picture' src={user.profile.image} roundedCircle />
                     <div className='user'>
                        <h2>{user.name}</h2>
                     </div>
                     <div className='rating'>
                        <p>{user.profile.bio}</p>
                        <StarRatings rating={user.profile.avgRating} count={user.profile.numReviews}/>
                     </div>
                     {viewerRole === "Job Poster" && (
                        <Button href="/create-job-post">Create a Job Post</Button>
                     )}
                  </Stack>
               </Col>
            </Row>
         </Container>
      )
   }
}
export default Dashboard