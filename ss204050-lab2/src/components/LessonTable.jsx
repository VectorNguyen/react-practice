import { Table, Button } from "react-bootstrap";

function LessonTable({ lessons, onEdit, onDelete }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Action</th>
          <th>Title</th>
          <th>Image</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody>
        {lessons.map((item) => (
          <tr key={item.id}>
            <td className="action-col">
              <Button variant="warning" className="me-2" onClick={() => onEdit(item)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => onDelete(item)}>
                Delete
              </Button>
            </td>
            <td>{item.lessonTitle}</td>
            <td className="image-col">
              <img src={item.lessonImage} alt={item.lessonTitle} className="lesson-img" />
            </td>
            <td>{item.level}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default LessonTable;
