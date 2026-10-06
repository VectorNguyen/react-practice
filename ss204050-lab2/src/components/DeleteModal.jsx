import { Modal, Button } from "react-bootstrap";

function DeleteModal({ show, lesson, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete lesson</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete "{lesson?.lessonTitle}"? This action
        cannot be undone.
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
