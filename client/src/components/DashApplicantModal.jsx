import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';

const DashApplicantModal = (props) => {
   const {applicants, title, show, onHide, taskId} = props
   const [applicantDetails, setApplicantDetails] = useState([])

   useEffect(() => {
      if (applicants && Array.isArray(applicants) && applicants.length > 0) {
         const fetchApplicantDetails = async () => {
            const results = []
            for (const applicant of applicants) {
               if (applicant && applicant.applicant && applicant.applicant._id) {
                  const response = await fetch(`http://localhost:5000/api/users/${applicant.applicant._id}`)
                  const data = await response.json()
                  results.push(data)
               }
            }
            setApplicantDetails(results)
         }
         fetchApplicantDetails()
      } else {
         setApplicantDetails([])
      }
   }, [applicants])

   const handleAcceptApplicant = async (taskId, applicantId) => {
      try {
         const response = await fetch(`http://localhost:5000/api/applications/accept/${taskId}/${applicantId}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json'
            }
         });
         
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to accept applicant');
         }
         
         onHide();
         
      } catch (error) {
         console.error('Error accepting applicant:', error);
      }
   };

   return (
      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...props}>
         <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Job Applicants</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <h4>{title}</h4>
            <div className="applicants-list">
               {applicantDetails.map((app, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between mb-3 p-3 border rounded" style={{ boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.05)' }}>
                     <div className="d-flex align-items-center gap-3">
                        <Image 
                           src={app.profile.image} 
                           roundedCircle 
                           style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div>
                           <span className="fs-5 d-block">{app.name}</span>
                           <span className="text-muted">{app.profile.bio}</span>
                        </div>
                     </div>
                     <Button 
                        size="sm" 
                        variant="primary"
                        onClick={() => handleAcceptApplicant(taskId, app._id)}
                     >
                        Accept
                     </Button>
                  </div>
               ))}
            </div>
         </Modal.Body>
         <Modal.Footer>
            <Button onClick={onHide}>Close</Button>
         </Modal.Footer>
      </Modal>
   );
}

export default DashApplicantModal;