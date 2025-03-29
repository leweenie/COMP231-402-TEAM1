import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const JobDetails = ({ jobId, onClose, show }) => {
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!jobId || !show) return;

            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch job details");
                }
                const data = await response.json();
                setJobDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId, show]);

    // if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!jobDetails) return null;

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{jobDetails.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {jobDetails.image && (
                    <div
                        style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "1rem",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={jobDetails.image}
                            alt={jobDetails.title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </div>
                )}

                <div className="mb-3">
                    <p>
                        <strong>Location:</strong> {jobDetails.location}
                    </p>
                    <p>
                        <strong>Posted:</strong>{" "}
                        {new Date(jobDetails.postDate).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Status:</strong> {jobDetails.status}
                    </p>
                </div>

                <div className="mb-3">
                    <h5>Description</h5>
                    <p>{jobDetails.description}</p>
                </div>

                {jobDetails.skills && jobDetails.skills.length > 0 && (
                    <div className="mb-3">
                        <h5>Required Powers</h5>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            {jobDetails.skills.split(",").map((skill, index) => (
                                <span
                                    key={index}
                                    style={{
                                        background: "#f8f9fa",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "20px",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default JobDetails;
