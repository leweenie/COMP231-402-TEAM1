import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import DashApplicantModal from './DashApplicantModal';

const ActiveJobDash = (props) => {
   // const {index, id, title, status, modalShow, setModalShow} = props
   const {index, id, title, status} = props

   const [applicants, setApplicants] = useState([])
   const [modalShow, setModalShow] = useState(false)


   useEffect(() => {
      if (id) {
         const url = `http://localhost:5000/api/applications/${id}`
         fetch(url)
         .then(res=>res.json()).then(data => setApplicants(data))
      }
   }, [id])

   return (
      <Accordion.Item className='dash-job' eventKey={index}>
         <Accordion.Header className='dash-job-header'>{title}</Accordion.Header>
         <Accordion.Body className='dash-job-body'>
            <div className='status'>Status: {status.toUpperCase()}</div>
            <div className='applicants'>
               Applicants: {applicants.length}
               <Button onClick={() => setModalShow(true)} className='small-button'>View All</Button>
               <DashApplicantModal applicants={applicants} title={title} show={modalShow} onHide={() => setModalShow(false)} />
            </div>
            <div className='view'>View Job</div>
         </Accordion.Body>
      </Accordion.Item>
   )
}

export default ActiveJobDash;