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
                              <p>Status: {job.status}</p>
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