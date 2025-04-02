import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const DashApplicantModal = (props) => {
   const {applicants, title, show, onHide} = props
   const [applicantDetails, setApplicantDetails] = useState([])

   useEffect(() => {
      if (applicants) {
         const results = []
         applicants.map(el => results.push(el.applicant))
         setApplicantDetails(results)
      }
   }, [applicants])

   const acceptApplicant = async (applicantId, taskId) => {
      try {
         const response = await fetch(`http://localhost:5000/api/application/accept/${applicantId}/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
         });

         if (!response.ok) {
            throw new Error("Failed to accept applicant.");
         }

         setApplicantDetails(prevDetails =>
            prevDetails.map(app =>
               app._id === applicantId ? { ...app, status: "accepted" } : app
            )
         );

         alert("Applicant accepted successfully!");
      } catch (error) {
         console.error(error);
         alert("Error accepting applicant.");
      }
   };

   return (
      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...props}>
         <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Job Applicants</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <h4>{title}</h4>
            Superheroes Applied:
            <ul>
               {applicantDetails.map((app, i) => (
                  <li key={i}>
                     {app.name}
                     {app.status !== "accepted" && (
                        <Button
                           variant="success"
                           size="sm"
                           className="ms-2"
                           onClick={() => acceptApplicant(app._id, props.jobid)}
                        >
                           Accept
                        </Button>
                     )}
                  </li>
               ))}
            </ul>
         </Modal.Body>
         <Modal.Footer>
         <Button onClick={onHide}>Close</Button>
         </Modal.Footer>
      </Modal>
   );
}

export default DashApplicantModal;