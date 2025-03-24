import React from 'react';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

const ApplicantsModal = ({ show, onHide, applicants }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Applicants</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {applicants.map((applicant) => (
            <ListGroup.Item key={applicant._id}>
              <div className="d-flex align-items-center">
                <img
                  src={applicant.profile.image}
                  alt={applicant.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginRight: '15px',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h5 className="mb-1">{applicant.name}</h5>
                  <p className="mb-1 text-muted">{applicant.profile.bio}</p>
                  <small className="text-muted">
                    Powers: {applicant.profile.powers.join(', ')}
                  </small>
                  <br />
                  <small className="text-muted">
                    Rating: {applicant.profile.avgRating} ({applicant.profile.numReviews} reviews)
                  </small>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default ApplicantsModal; 