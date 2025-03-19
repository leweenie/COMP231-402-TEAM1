import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/esm/Stack';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import { getUserData, getUserTasksByPosterId, getApplicantsByTask } from '../data/callDataFuncs';
import { useState } from 'react';

const Dashboard = (props) => {
   const { userId } = props;
   const [user, setUser] = useState(getUserData(userId))
   const [tasks, setTasks] = useState(() => getUserTasksByPosterId(userId))

   


   if (user) {
      return (
         <Container className='p-2'>
            <Row className='p-2'>
               <Col xs={12} sm={8}>
                  <Stack className='dash-job-panel p-4' direction='vertical' gap={3}>
                     <h2>Track Active Jobs</h2>
                     <Accordion>
                        {tasks.map((task, i) => <ActiveJob key={i} index={i} id={task.id} title={task.title} status={task.status} />)}
                     </Accordion>
                  </Stack>
                  
               </Col>
               <Col xs={12} sm={4}>
                  <Stack className='dash-profile-panel p-4' direction='vertical' gap={3}>
                     <Image className='profile-picture' src="/src/assets/sample-poster-profile.jpg" roundedCircle />
                     <div className='user'>
                        <h2>{user.name}</h2>
                     </div>
                     <div className='rating'>
                        <p>{user.profile.bio}</p>
                        <Stars rating={user.profile.avgRating} count={user.profile.numReviews}/>
                     </div>
                     <Button>Create a Job Post</Button>
                  </Stack>
               </Col>
            </Row>
         </Container>
      )
   }
}
export default Dashboard

const ActiveJob = (props) => {
   const {index, id, title, status} = props
   const [applicants, setApplicants] = useState(() => getApplicantsByTask(id))

   return (
      <Accordion.Item className='dash-job' eventKey={index}>
         <Accordion.Header className='dash-job-header'>{title}</Accordion.Header>
         <Accordion.Body className='dash-job-body'>
            <div className='status'>Status: {status.toUpperCase()}</div>
            <div className='applicants'>Applicants: {applicants.length}</div>
            <div className='view'>View Job</div>
         </Accordion.Body>
      </Accordion.Item>
   )
}

const Stars = (props) => {
   const {rating, count} = props

   const getImage = () => {
      let value
      if (rating < 0.75) value = '/src/assets/stars/0-5.png'
      else if (rating < 1.25) value = '/src/assets/stars/1-0.png'
      else if (rating < 1.75) value = '/src/assets/stars/1-5.png'
      else if (rating < 2.25) value = '/src/assets/stars/2-0.png'
      else if (rating < 2.75) value = '/src/assets/stars/2-5.png'
      else if (rating < 3.25) value = '/src/assets/stars/3-0.png'
      else if (rating < 3.75) value = '/src/assets/stars/3-5.png'
      else if (rating < 4.25) value = '/src/assets/stars/4-0.png'
      else if (rating < 4.75) value = '/src/assets/stars/4-5.png'
      else value = '/src/assets/stars/5-0.png'
      return value
   }

   if (rating && count) return (
      <div><img src={`${getImage()}`}/> {`(${count})`}</div>
   )
}