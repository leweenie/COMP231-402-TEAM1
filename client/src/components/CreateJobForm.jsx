import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CreateJobForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", event.target[0].value);
    formData.append("location", event.target[1].value);
    formData.append("description", event.target[2].value);

    // Get selected abilities
    const selectedAbilities = Array.from(event.target[4].selectedOptions).map(opt => opt.value);
    formData.append("skills", selectedAbilities.join(","));

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Job submitted successfully!");
      } else {
        alert("Error submitting job");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container className='p-2'>
      <Form>
        <Form.Control type="text" required placeholder="Title" className="mb-3"/>
        <Form.Control type="text" required placeholder="Location" className="mb-3" />
        <Form.Control as="textarea" required type="text" placeholder="Add description" className="mb-3" />
        <Form.Label>This calls for...</Form.Label>
        <Form.Select className="form-multi-select mb-3" id="multi-select" multiple>
          <option value="opt-1">Telekinesis</option>
          <option value="opt-2">Super Strength</option>
          <option value="opt-3">X-Ray Vision</option>
          <option value="opt-4">Other</option>
        </Form.Select>
        <Form.Control type="file" id="image" className="mb-3" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
export default CreateJobForm