import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';

import DashApplicantModal from './DashApplicantModal';
import JobDetails from './JobDetails';

const ActiveJobDash = (props) => {
   const {index, id, title, status, viewerRole, creatorId} = props

   const [applicants, setApplicants] = useState([])
   const [acceptedApplicant, setAcceptedApplicant] = useState(null)
   const [jobPoster, setJobPoster] = useState(null)
   const [modalShow, setModalShow] = useState(false)
   const [showJobDetails, setShowJobDetails] = useState(false)


   useEffect(() => {
      if (id) {
         if (viewerRole === "Job Poster") {
            const url = `http://localhost:5000/api/applications/${id}`
            fetch(url)
            .then(res=>res.json())
            .then(data => {
               setApplicants(data);
               
               const accepted = data.find(app => app.status === "accepted");
               if (accepted) {
                  fetch(`http://localhost:5000/api/users/${accepted.applicant._id}`)
                     .then(res => res.json())
                     .then(userData => {
                        setAcceptedApplicant(userData);
                     })
                     .catch(err => console.error("Error fetching accepted applicant details:", err));
               }
            })
            .catch(err => console.error("Error fetching applicants:", err));
         } else if (viewerRole === "Superhero" && creatorId) {
            fetch(`http://localhost:5000/api/users/${creatorId}`)
               .then(res => res.json())
               .then(userData => {
                  setJobPoster(userData);
               })
               .catch(err => console.error("Error fetching job poster details:", err));
         }
      }
   }, [id, modalShow, viewerRole, creatorId])

   return (
      <Accordion.Item className='dash-job' eventKey={index}>
         <Accordion.Header className='dash-job-header'>{title}</Accordion.Header>
         <Accordion.Body className='dash-job-body' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className='status' style={{ flex: '1' }}>
               Status: {status.toUpperCase()}
            </div>
            
            {viewerRole === "Job Poster" ? (
               <div className='applicants' style={{ flex: '2', textAlign: 'center' }}>
                  {acceptedApplicant ? (
                     <div className="d-flex align-items-center justify-content-center gap-2">
                        <span>Assigned to:</span>
                        <div className="d-flex align-items-center gap-2">
                           <Image 
                              src={acceptedApplicant.profile.image} 
                              roundedCircle 
                              style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                           />
                           <span>{acceptedApplicant.name}</span>
                        </div>
                     </div>
                  ) : (
                     <div>
                        Applicants: {applicants.length}
                        {applicants.length > 0 ? (
                           <Button onClick={() => setModalShow(true)} className='small-button'>View All</Button>
                        ) : (
                           <span className="text-muted ms-2" style={{ fontSize: '0.9rem' }}>(Currently no applications)</span>
                        )}
                     </div>
                  )}
                  <DashApplicantModal applicants={applicants} taskId={id} title={title} show={modalShow} onHide={() => setModalShow(false)} />
               </div>
            ) : (
               <div className='applicants' style={{ flex: '2', textAlign: 'center' }}>
                  {jobPoster && (
                     <div className="d-flex align-items-center justify-content-center gap-2">
                        <span>Posted by:</span>
                        <div className="d-flex align-items-center gap-2">
                           <Image 
                              src={jobPoster.profile.image} 
                              roundedCircle 
                              style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                           />
                           <span>{jobPoster.name}</span>
                        </div>
                     </div>
                  )}
               </div>
            )}
            
            <div style={{ flex: '1', textAlign: 'right' }}>
               <Button 
                  variant="outline-primary" 
                  onClick={() => setShowJobDetails(true)}
                  style={{ height: 'fit-content' }}
               >
                  View Job
               </Button>
            </div>
            <JobDetails jobId={id} show={showJobDetails} onClose={() => setShowJobDetails(false)} />
         </Accordion.Body>
      </Accordion.Item>
   )
}

export default ActiveJobDash;