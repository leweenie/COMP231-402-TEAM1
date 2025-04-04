import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';

import DashApplicantModal from './DashApplicantModal';
import JobDetails from './JobDetails';

const ActiveJobDash = (props) => {
   const {index, id, title, status, applicationStatus, viewerRole, creatorId} = props

   const [applicants, setApplicants] = useState([])
   const [acceptedApplicant, setAcceptedApplicant] = useState(null)
   const [jobPoster, setJobPoster] = useState(null)
   const [modalShow, setModalShow] = useState(false)
   const [showJobDetails, setShowJobDetails] = useState(false)
   const [isUpdating, setIsUpdating] = useState(false)


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

   const getStatusBadgeVariant = (status) => {
      if (!status) return 'secondary';
      
      switch(status.toLowerCase()) {
         case 'pending': return 'warning';
         case 'accepted': return 'success';
         case 'rejected': return 'danger';
         case 'active': return 'success';
         case 'completed': return 'info';
         case 'inprogress': return 'primary';
         default: return 'secondary';
      }
   }

   useEffect(() => {
      const handleAccordionChange = () => {
         const accordionItems = document.querySelectorAll('.accordion-item');
         accordionItems.forEach(item => {
            const statusIndicator = item.querySelector('.status-indicator');
            const isExpanded = item.querySelector('.accordion-button:not(.collapsed)');
            
            if (statusIndicator) {
               statusIndicator.style.display = isExpanded ? 'block' : 'none';
            }
         });
      };
      
      handleAccordionChange();
      
      document.addEventListener('click', event => {
         if (event.target.classList.contains('accordion-button') || 
             event.target.closest('.accordion-button')) {
            setTimeout(handleAccordionChange, 10);
         }
      });
      
      return () => {
         document.removeEventListener('click', handleAccordionChange);
      };
   }, []);

   const markJobAsComplete = async () => {
      if (!id) return;
      
      try {
         setIsUpdating(true);
         const response = await fetch(`http://localhost:5000/api/jobs/complete/${id}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'completed' })
         });
         
         if (response.ok) {
            window.location.reload();
         } else {
            console.error('Failed to update job status');
            alert('Failed to mark job as complete');
         }
      } catch (error) {
         console.error('Error marking job as complete:', error);
         alert('Error marking job as complete');
      } finally {
         setIsUpdating(false);
      }
   };

   return (
      <Accordion.Item className='dash-job' eventKey={index}>
         <Accordion.Header className='dash-job-header'>{title}</Accordion.Header>
         
         {viewerRole === "Superhero" && applicationStatus && (
            <div 
               className="status-indicator" 
               style={{ 
                  display: 'none',
                  padding: '0.5rem',
                  textAlign: 'center',
                  backgroundColor: applicationStatus === 'pending' ? '#fff3cd' : 
                                   applicationStatus === 'accepted' ? '#d1e7dd' : 
                                   applicationStatus === 'rejected' ? '#f8d7da' : '#e2e3e5',
                  color: applicationStatus === 'pending' ? '#664d03' : 
                         applicationStatus === 'accepted' ? '#0f5132' : 
                         applicationStatus === 'rejected' ? '#842029' : '#41464b',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #dee2e6'
               }}
               data-status={applicationStatus}
            >
               Application Status: {applicationStatus.toUpperCase()}
            </div>
         )}

         <Accordion.Body className='dash-job-body' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className='status' style={{ flex: '1' }}>
               <div className="d-flex align-items-center">
                  <span className="me-2">Status:</span>
                  <span 
                     className="status-badge"
                     style={{ 
                        display: 'inline-block',
                        padding: '0.4rem 0.7rem',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        borderRadius: '0.25rem',
                        backgroundColor: getStatusBadgeVariant(status) === 'warning' ? '#ffc107' : 
                                        getStatusBadgeVariant(status) === 'success' ? '#106cfc' : 
                                        getStatusBadgeVariant(status) === 'danger' ? '#dc3545' : 
                                        getStatusBadgeVariant(status) === 'info' ? '#ffb444' : 
                                        getStatusBadgeVariant(status) === 'primary' ? '#0d6efd' : '#6c757d',
                        color: getStatusBadgeVariant(status) === 'warning' ? '#000' : '#fff'
                     }}
                  >
                     {status.toUpperCase()}
                  </span>
               </div>
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
               <div className="d-flex justify-content-end gap-2">
                  {viewerRole === "Superhero" && 
                   applicationStatus === "accepted" && 
                   status.toLowerCase() !== "completed" && (
                     <Button 
                        variant="success" 
                        onClick={markJobAsComplete}
                        disabled={isUpdating}
                        style={{ height: 'fit-content' }}
                     >
                        {isUpdating ? 'Updating...' : 'Mark Complete'}
                     </Button>
                  )}
                  <Button 
                     variant="outline-primary" 
                     onClick={() => setShowJobDetails(true)}
                     style={{ height: 'fit-content' }}
                  >
                     View Job
                  </Button>
               </div>
            </div>
            <JobDetails jobId={id} show={showJobDetails} onClose={() => setShowJobDetails(false)} />
         </Accordion.Body>
      </Accordion.Item>
   )
}

export default ActiveJobDash;