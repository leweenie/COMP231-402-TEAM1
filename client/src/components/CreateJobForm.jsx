import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CreateJobForm = () => {
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
        <Form.Control type="file" id="image" className="mb-3" />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
export default CreateJobForm