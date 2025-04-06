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
import JobHistoryModal from './JobHistoryModal'; 

const Dashboard = (props) => { 
   const { userId, viewerRole } = props;
   const [tasks, setTasks] = useState([]);
   const [user, setUser] = useState({});
   const [jobHistory, setJobHistory] = useState([]);
   const [showHistoryModal, setShowHistoryModal] = useState(false); 
   const [isLoading, setIsLoading] = useState(false); 

   useEffect(() => {
      if (userId) {
         const url = `http://localhost:5000/api/users/${userId}`
         fetch(url)
         .then(res=>res.json()).then(data => setUser(data))
      }
   }, [userId]);

   const fetchJobHistory = () => {
      setIsLoading(true);
      fetch('http://localhost:5000/api/jobs')
         .then(res => res.json())
         .then(data => {
            let history;
            if (viewerRole === "Job Poster") {
               history = data.filter(job => 
                  job.creator === user._id && 
                  (job.status === "completed" || job.status === "inactive")
               );
               setJobHistory(history);
               setIsLoading(false);
            } else if (viewerRole === "Superhero") {
               fetch(`http://localhost:5000/api/applications/all`)
                  .then(res => res.json())
                  .then(applications => {
                     const userApplications = applications.filter(app => 
                        app.applicant && app.applicant._id === userId
                     );
                     
                     const applicationStatusMap = {};
                     userApplications.forEach(app => {
                        applicationStatusMap[app.task] = app.status;
                     });
                     
                     const completedJobs = data.filter(job => 
                        job.status === "completed" && 
                        userApplications.some(app => app.task === job._id)
                     ).map(job => ({
                        ...job,
                        applicationStatus: applicationStatusMap[job._id]
                     }));
                     
                     setJobHistory(completedJobs);
                     setIsLoading(false);
                  })
                  .catch(err => {
                     console.error("Error fetching applications:", err);
                     setIsLoading(false);
                  });
            } else {
               history = [];
               setJobHistory(history);
               setIsLoading(false);
            }
         })
         .catch(err => {
            console.error("Error fetching jobs:", err);
            setIsLoading(false);
         });
   };

   const handleJobHistoryClick = () => {
      fetchJobHistory();  
      setShowHistoryModal(true); 
   };

   useEffect(() => {
      if (Object.keys(user).length) {
         const url = 'http://localhost:5000/api/jobs/'
         
         if (viewerRole === "Job Poster") {
            fetch(url)
            .then(res=>res.json())
            .then(data => {
               const activeTasks = data.filter(job => 
                  job.creator === user._id && 
                  job.status !== "completed" && 
                  job.status !== "inactive"
               );
               setTasks(activeTasks);
            })
            .catch(err => console.error("Error fetching jobs:", err));
         } else if (viewerRole === "Superhero") {
            fetch(url)
            .then(res => res.json())
            .then(allJobs => {
               fetch(`http://localhost:5000/api/applications/all`)
               .then(res => res.json())
               .then(applications => {
                  const userApplications = applications.filter(app => 
                     app.applicant && app.applicant._id === userId
                  );
                  
                  if (userApplications.length > 0) {
                     const applicationStatusMap = {};
                     userApplications.forEach(app => {
                        applicationStatusMap[app.task] = app.status;
                     });
                     
                     const appliedJobs = allJobs
                        .filter(job => 
                           userApplications.some(app => app.task === job._id) &&
                           job.status !== "completed"
                        )
                        .map(job => ({
                           ...job,
                           applicationStatus: applicationStatusMap[job._id]
                        }));
                     
                     setTasks(appliedJobs);
                  } else {
                     setTasks([]);
                  }
               })
               .catch(err => console.error("Error fetching applications:", err));
            })
            .catch(err => console.error("Error fetching jobs:", err));
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
                              applicationStatus={task.applicationStatus}
                              viewerRole={viewerRole}
                              creatorId={task.creator}
                           />
                        ) : (
                           <div className="text-center p-3">
                              {viewerRole === "Superhero" ? 
                                 "You haven't applied to any active jobs." : 
                                 "You don't have any active jobs."}
                           </div>
                        )}
                     </Accordion>
                     <Button onClick={handleJobHistoryClick}>Job History</Button> 
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
                        <StarRatings rating={user.profile.avgRating} count={user.profile.numReviews} />
                     </div>
                     {viewerRole === "Job Poster" && (
                        <Button href="/create-job-post">Create a Job Post</Button>
                     )}
                  </Stack>
               </Col>
            </Row>
            <JobHistoryModal 
               show={showHistoryModal} 
               onHide={() => setShowHistoryModal(false)} 
               jobs={jobHistory} 
               isLoading={isLoading} 
               viewerRole={viewerRole}
            />
         </Container>
      )
   }

   return null;
}

export default Dashboard;