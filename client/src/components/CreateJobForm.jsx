import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";

const CreateJobForm = ({ userId }) => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", event.target[0].value);
    formData.append("location", event.target[1].value);
    formData.append("description", event.target[2].value);

    const selectElement = event.target.querySelector("#multi-select");
    const selectedAbilities = selectElement
      ? Array.from(selectElement.selectedOptions).map(opt => opt.value)
      : [];

    formData.append("skills", selectedAbilities.join(","));

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    formData.append("creator", userId); 


    try {
      const response = await fetch("http://localhost:5000/api/jobs/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Job submitted successfully!");
        navigate("/job-board");
      } else {
        const errorText = await response.text();
        console.error("Server responded with:", response.status, errorText);
        alert("Error submitting job: " + errorText);
      }
    } catch (error) {
      console.error("Network or code error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <Container className='p-2'>
      <Form onSubmit={handleSubmit}>
        <Form.Control type="text" required placeholder="Title" className="mb-3" name="title" />
        <Form.Control type="text" required placeholder="Location" className="mb-3" name="location" />
        <Form.Control as="textarea" required placeholder="Add description" className="mb-3" name="description" />

        <Form.Label>This calls for...</Form.Label>
        <Form.Select id="multi-select" name="skills" multiple className="form-multi-select mb-3">
          <option value="Telekinesis">Telekinesis</option>
          <option value="Super Strength">Super Strength</option>
          <option value="X-Ray Vision">X-Ray Vision</option>
          <option value="Other">Other</option>
        </Form.Select>

        <Form.Control
          type="file"
          id="image"
          className="mb-3"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default CreateJobForm;
