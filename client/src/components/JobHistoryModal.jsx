import { useState } from 'react';
import { Modal, Button, ListGroup, Spinner } from 'react-bootstrap';
import JobDetails from './JobDetails'; 
import { useNavigate } from 'react-router-dom';

const JobHistoryModal = ({ show, onHide, jobs, isLoading, viewerRole }) => {
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [showJobDetails, setShowJobDetails] = useState(false);
   const navigate = useNavigate();

   const handleViewJob = (jobId) => {
      setSelectedJobId(jobId);
      setShowJobDetails(true);
   };
   
   const handleProfileClick = (userId, jobId) => {
      navigate(`/user/${userId}?taskId=${jobId}`);
      onHide();
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
                              {viewerRole === "Superhero" && job.creator && (
                                 <div className="my-2">
                                    <Button 
                                       variant="link" 
                                       className="p-0" 
                                       onClick={() => handleProfileClick(job.creator, job._id)}
                                    >
                                       Leave a Review for Poster!
                                       </Button>
                                 </div>
                              )}
                              {viewerRole === "Job Poster" && job.claimedBy && (
                                 <div className="my-2">
                                    <Button 
                                       variant="link" 
                                       className="p-0" 
                                       onClick={() => handleProfileClick(job.claimedBy, job._id)}
                                    >
                                       Leave a Review for Superhero!
                                    </Button>
                                 </div>
                              )}
                              {job.applicationStatus !== 'rejected' && (
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
                              )}
                              {job.applicationStatus && (
                                 <div 
                                    className="application-status my-2" 
                                    style={{ 
                                       display: 'inline-block',
                                       padding: '0.4rem 0.7rem',
                                       borderRadius: '0.25rem',
                                       fontSize: '0.85rem',
                                       backgroundColor: job.applicationStatus === 'pending' ? '#fff3cd' : 
                                                      job.applicationStatus === 'accepted' ? '#d1e7dd' : 
                                                      job.applicationStatus === 'rejected' ? '#f8d7da' : '#e2e3e5',
                                       color: job.applicationStatus === 'pending' ? '#664d03' : 
                                              job.applicationStatus === 'accepted' ? '#0f5132' : 
                                              job.applicationStatus === 'rejected' ? '#842029' : '#41464b',
                                       fontWeight: 'bold',
                                       marginRight: '1rem'
                                    }}
                                 >
                                    Application Status: {job.applicationStatus.toUpperCase()}
                                 </div>
                              )}
                              <div className="mt-2">
                                <Button variant="link" onClick={() => handleViewJob(job._id)}>
                                   View Job Post
                                </Button>
                              </div>
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
