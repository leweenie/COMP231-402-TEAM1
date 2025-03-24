import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const DashApplicantModal = (props) => {
   const {applicants, title, show, onHide} = props
   const [applicantNames, setApplicantNames] = useState([])

   useEffect(() => {

   })

   return (
      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered {...props}>
         <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Job Applicants</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <h4>{title}</h4>
            <ul>
               {applicants.map((app, i) => (<li key={i}>User ID: {app.applicantId}</li>))}
            </ul>
         </Modal.Body>
         <Modal.Footer>
         <Button onClick={onHide}>Close</Button>
         </Modal.Footer>
      </Modal>
   );
}

export default DashApplicantModal;