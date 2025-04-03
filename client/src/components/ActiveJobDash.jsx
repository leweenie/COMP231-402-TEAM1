import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';

import DashApplicantModal from './DashApplicantModal';
import JobDetails from './JobDetails';

const ActiveJobDash = (props) => {
   // const {index, id, title, status, modalShow, setModalShow} = props
   const {index, id, title, status} = props

   const [applicants, setApplicants] = useState([])
   const [acceptedApplicant, setAcceptedApplicant] = useState(null)
   const [modalShow, setModalShow] = useState(false)
   const [showJobDetails, setShowJobDetails] = useState(false)


   useEffect(() => {
      if (id) {
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
      }
   }, [id, modalShow])

   return (
      <Accordion.Item className='dash-job' eventKey={index}>
         <Accordion.Header className='dash-job-header'>{title}</Accordion.Header>
         <Accordion.Body className='dash-job-body'>
            <div className='status'>Status: {status.toUpperCase()}</div>
            <div className='applicants'>
               {acceptedApplicant ? (
                  <div className="d-flex align-items-center gap-2">
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
                  <>
                     Applicants: {applicants.length}
                     <Button onClick={() => setModalShow(true)} className='small-button'>View All</Button>
                  </>
               )}
               <DashApplicantModal applicants={applicants} taskId={id} title={title} show={modalShow} onHide={() => setModalShow(false)} />
            </div>
            <Button variant="outline-primary" onClick={() => setShowJobDetails(true)}>View Job</Button>
            <JobDetails jobId={id} show={showJobDetails} onClose={() => setShowJobDetails(false)} />
         </Accordion.Body>
      </Accordion.Item>
   )
}

export default ActiveJobDash;