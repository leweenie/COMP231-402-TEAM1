import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const UpdateTaskPage = () => {
  const { jobId } = useParams(); // Get task ID from URL
  const navigate = useNavigate(); // Hook for navigation

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    skills: [],
    image: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const url = `http://localhost:5000/api/jobs/${jobId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch task details");

        const data = await response.json();
        setFormData({
          title: data.title,
          location: data.location || "",
          description: data.description || "",
          skills: data.skills || [],
          image: data.image || null,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [jobId]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle multiple skill selection
  const handleSkillChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, skills: selectedOptions });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formUpdate = new FormData();
    formUpdate.append("title", formData.title);
    formUpdate.append("location", formData.location);
    formUpdate.append("description", formData.description);
    formData.skills.forEach((skill) => formUpdate.append("skills", skill));
    if (formData.image) formUpdate.append("image", formData.image);

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}}`, {
        method: "PUT",
        body: formUpdate,
      });

      if (!response.ok) throw new Error("Failed to update task");

      navigate("/dashboard"); // Redirect after update
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading task details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>Update Task</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          required
          placeholder="Title"
          className="mb-3"
          onChange={handleChange}
        />
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          required
          placeholder="Location"
          className="mb-3"
          onChange={handleChange}
        />
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          required
          placeholder="Add description"
          className="mb-3"
          onChange={handleChange}
        />
        <Form.Label>This calls for...</Form.Label>
        <Form.Select
          className="form-multi-select mb-3"
          id="multi-select"
          multiple
          value={formData.skills}
          onChange={handleSkillChange}
        >
          <option value="Telekinesis">Telekinesis</option>
          <option value="Super Strength">Super Strength</option>
          <option value="X-Ray Vision">X-Ray Vision</option>
          <option value="Other">Other</option>
        </Form.Select>
        <Form.Control
          type="file"
          id="image"
          className="mb-3"
          onChange={handleFileChange}
        />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default UpdateTaskPage;
