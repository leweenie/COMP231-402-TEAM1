import { useState } from 'react';
import { Modal, Button, ListGroup, Spinner } from 'react-bootstrap';
import JobDetails from './JobDetails'; 

const JobHistoryModal = ({ show, onHide, jobs, isLoading }) => {
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [showJobDetails, setShowJobDetails] = useState(false);

   const handleViewJob = (jobId) => {
      setSelectedJobId(jobId);
      setShowJobDetails(true);
   };
   
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

   return (
      <>
         <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
               <Modal.Title>Job History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {isLoading ? (
                  <div className="d-flex justify-content-center">
                     <Spinner animation="border" variant="primary" />
                  </div>
               ) : (
                  <ListGroup>
                     {jobs.length > 0 ? (
                        jobs.map((job) => (
                           <ListGroup.Item key={job._id}>
                              <h5>{job.title}</h5>
                              <div className="d-flex align-items-center my-2">
                                 <span className="me-2">Status:</span>
                                 <span 
                                    className="status-badge"
                                    style={{ 
                                       display: 'inline-block',
                                       padding: '0.4rem 0.7rem',
                                       fontSize: '0.85rem',
                                       fontWeight: '500',
                                       borderRadius: '0.25rem',
                                       backgroundColor: getStatusBadgeVariant(job.status) === 'warning' ? '#ffc107' : 
                                                   getStatusBadgeVariant(job.status) === 'success' ? '#106cfc' : 
                                                   getStatusBadgeVariant(job.status) === 'danger' ? '#dc3545' : 
                                                   getStatusBadgeVariant(job.status) === 'info' ? '#ffb444' : 
                                                   getStatusBadgeVariant(job.status) === 'primary' ? '#0d6efd' : '#6c757d',
                                       color: getStatusBadgeVariant(job.status) === 'warning' ? '#000' : '#fff'
                                    }}
                                 >
                                    {job.status.toUpperCase()}
                                 </span>
                              </div>
                              <Button variant="link" onClick={() => handleViewJob(job._id)}>
                                 View Job Post
                              </Button>
                           </ListGroup.Item>
                        ))
                     ) : (
                        <p>No job history available.</p>
                     )}
                  </ListGroup>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
         </Modal>

         {selectedJobId && showJobDetails && (
            <JobDetails
               jobId={selectedJobId}
               show={showJobDetails}
               onClose={() => setShowJobDetails(false)}
            />
         )}
      </>
   );
};

export default JobHistoryModal;