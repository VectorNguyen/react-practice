import { useState } from "react";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import data from "./jlpt_lessons.json";
import "./App.css";

// ===== Luật kiểm tra dữ liệu của form (Yup) =====
const schema = Yup.object({
  lessonTitle: Yup.string().required("Title is required."),
  lessonImage: Yup.string().required("Lesson image URL is required."),
  estimatedTime: Yup.number()
    .typeError("Estimated time must be a number.")
    .required("Estimated time is required.")
    .min(1, "Estimated time must be at least 1 minute."),
  level: Yup.string()
    .required("Please select a valid level.")
    .oneOf(["N1", "N2", "N3", "N4", "N5"], "Please select a valid level."),
});

// Giá trị rỗng của form khi thêm mới
const emptyLesson = {
  lessonTitle: "",
  lessonImage: "",
  estimatedTime: 0,
  level: "",
  isCompleted: false,
};

function App() {
  // ===== STATE =====
  // Danh sách bài học, ban đầu lấy từ file JSON
  const [lessons, setLessons] = useState(data);

  // Modal thêm / sửa
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null); // null = đang thêm mới

  // Modal xoá
  const [showDelete, setShowDelete] = useState(false);
  const [deletingLesson, setDeletingLesson] = useState(null);

  // Thông báo (alert)
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  // ===== THÔNG BÁO =====
  // Hiện thông báo, 3 giây sau tự ẩn
  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  const handleCloseAlert = () => {
    setAlertMessage("");
  };

  // ===== FORMIK =====
  // Đang sửa thì form lấy dữ liệu bài đó, đang thêm thì form rỗng
  let startValues = emptyLesson;
  if (editingLesson !== null) {
    startValues = editingLesson;
  }

  const formik = useFormik({
    initialValues: startValues,
    enableReinitialize: true, // đổi bài cần sửa thì form tự nạp lại dữ liệu
    validationSchema: schema,
    onSubmit: (values) => {
      const lessonData = {
        ...values,
        estimatedTime: Number(values.estimatedTime), // ô input trả về chuỗi, đổi sang số
      };

      if (editingLesson === null) {
        // Thêm mới: tìm id lớn nhất rồi cộng 1 để id không bị trùng
        let maxId = 0;
        for (const item of lessons) {
          if (Number(item.id) > maxId) {
            maxId = Number(item.id);
          }
        }
        const newLesson = { ...lessonData, id: String(maxId + 1) };
        setLessons([...lessons, newLesson]);
        showAlert("Add lesson successfully!", "success");
      } else {
        // Sửa: bài nào trùng id thì thay bằng dữ liệu mới
        const newList = lessons.map((item) => {
          if (item.id === editingLesson.id) {
            return { ...lessonData, id: item.id };
          }
          return item;
        });
        setLessons(newList);
        showAlert("Update lesson successfully!", "success");
      }

      formik.resetForm();
      setShowForm(false);
    },
  });

  // ===== THÊM / SỬA =====
  const handleAddClick = () => {
    setEditingLesson(null);
    setShowForm(true);
  };

  const handleEditClick = (lesson) => {
    setEditingLesson(lesson);
    setShowForm(true);
  };

  // Đóng form: xoá dữ liệu đang nhập và lỗi
  const handleCloseForm = () => {
    formik.resetForm();
    setShowForm(false);
  };

  // ===== XOÁ =====
  const handleDeleteClick = (lesson) => {
    setDeletingLesson(lesson);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const handleConfirmDelete = () => {
    // Giữ lại những bài có id khác bài cần xoá
    const newList = lessons.filter((item) => item.id !== deletingLesson.id);

    // Danh sách ngắn đi nghĩa là đã xoá được
    if (newList.length < lessons.length) {
      setLessons(newList);
      showAlert("Delete lesson successfully!", "success");
    } else {
      showAlert("Delete lesson failed!", "danger");
    }
    setShowDelete(false);
  };

  // ===== GIAO DIỆN =====
  return (
    <>
      {/* Thanh menu */}
      <nav className="navbar-custom">
        <a href="#">Home</a>
        <a href="#">Lesson Management</a>
        <a href="#">Completed Lesson</a>
      </nav>

      <Container className="mt-4">
        <h1 className="mb-4">Lesson List</h1>

        {/* Thông báo */}
        {alertMessage && (
          <Alert variant={alertVariant} onClose={handleCloseAlert} dismissible>
            {alertMessage}
          </Alert>
        )}

        <div className="text-end mb-3">
          <Button variant="primary" size="lg" onClick={handleAddClick}>
            Add Lesson
          </Button>
        </div>

        {/* Bảng danh sách bài học */}
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
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteClick(item)}>
                    Delete
                  </Button>
                </td>
                <td>{item.lessonTitle}</td>
                <td className="image-col">
                  <img
                    src={item.lessonImage}
                    alt={item.lessonTitle}
                    className="lesson-img"
                  />
                </td>
                <td>{item.level}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Modal thêm / sửa */}
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingLesson === null ? "Add Lesson" : "Edit Lesson"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Lesson title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                name="lessonTitle"
                placeholder="Enter lesson title"
                value={formik.values.lessonTitle}
                onChange={formik.handleChange}
                isInvalid={formik.touched.lessonTitle && formik.errors.lessonTitle}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.lessonTitle}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Lesson Image URL <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                name="lessonImage"
                placeholder="Enter lesson image URL"
                value={formik.values.lessonImage}
                onChange={formik.handleChange}
                isInvalid={formik.touched.lessonImage && formik.errors.lessonImage}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.lessonImage}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Lesson Time (in minutes) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="estimatedTime"
                value={formik.values.estimatedTime}
                onChange={formik.handleChange}
                isInvalid={formik.touched.estimatedTime && formik.errors.estimatedTime}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.estimatedTime}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Level <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="level"
                value={formik.values.level}
                onChange={formik.handleChange}
                isInvalid={formik.touched.level && formik.errors.level}
              >
                <option value="">Select level</option>
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.level}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Check
              type="checkbox"
              name="isCompleted"
              label="Is complete"
              checked={formik.values.isCompleted}
              onChange={formik.handleChange}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseForm}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal xác nhận xoá */}
      <Modal show={showDelete} onHide={handleCloseDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete lesson</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete "{deletingLesson?.lessonTitle}"? This
          action cannot be undone.
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
