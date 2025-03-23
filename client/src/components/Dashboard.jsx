import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/esm/Stack';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import { getUserData, getUserTasksByPosterId, getApplicantsByTask } from '../data/callDataFuncs';
import ApplicantModal from './ApplicantModal';
// import { getUserByID } from '../../../server/controllers/userControllers';
import { useState, useEffect } from 'react';

const Dashboard = (props) => { 
   const { userId } = props;
   const [tasks, setTasks] = useState(() => getUserTasksByPosterId(10)) // still using temp data here
   const [user, setUser] = useState({})
   const [modalShow, setModalShow] = useState(false)

   useEffect(() => {
      const url = `http://localhost:5000/api/users/${userId}`
      fetch(url)
      .then(res=>res.json()).then(data => setUser(data))
   }, [userId])



   if (user.name) {
      return (
         <Container className='p-2'>
            <Row className='p-2'>
               <Col xs={12} sm={8}>
                  <Stack className='dash-job-panel p-4' direction='vertical' gap={3}>
                     {/* <ApplicantModal show={modalShow} onHide={() => setModalShow(false)} /> */}
                     <h2>Track Active Jobs</h2>
                     <Accordion>
                        {tasks.map((task, i) => <ActiveJob key={i} index={i} id={task.id} title={task.title} status={task.status} modalShow={modalShow} setModalShow={setModalShow} />)}
                     </Accordion>
                  </Stack>
                  
               </Col>
               <Col xs={12} sm={4}>
                  <Stack className='dash-profile-panel p-4' direction='vertical' gap={3}>
                     {/* <Image className='profile-picture' src="/src/assets/profiles/profile4.jpg" roundedCircle /> */}
                     <Image className='profile-picture' src={user.profile.image} roundedCircle />

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
   const {index, id, title, status, modalShow, setModalShow} = props
   const [applicants, setApplicants] = useState([])

   useEffect(() => {
      const data = getApplicantsByTask(id)
      setApplicants(data)
   }, [id])

   // useEffect(() => {
   //    const url = `http://localhost:5000/api/jobs/${id}`
   //    fetch(url)
   //    .then(res=>res.json()).then(data => setApplicants(data))
   // }, [id])

   return (
      <Accordion.Item className='dash-job' eventKey={index}>
         <Accordion.Header className='dash-job-header'>{title}</Accordion.Header>
         <Accordion.Body className='dash-job-body'>
            <div className='status'>Status: {status.toUpperCase()}</div>
            <div className='applicants'>
               Applicants: {applicants.length}
               <Button onClick={() => setModalShow(true)} className='small-button'>View All</Button>
               <ApplicantModal applicants={applicants} title={title} show={modalShow} onHide={() => setModalShow(false)} />
            </div>
            <div className='view'>View Job</div>
         </Accordion.Body>
      </Accordion.Item>
   )
}

const Stars = (props) => {
   const {_rating, _count} = props
   const rating = isNaN(_rating) ? 4.5 : _rating
   const count = isNaN(_count) ? 2 : _count

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