import { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import data from "./jlpt_lessons.json";
import LessonTable from "./components/LessonTable";
import LessonFormModal from "./components/LessonFormModal";
import DeleteModal from "./components/DeleteModal";
import "./App.css";

function App() {
  // Danh sách bài học (lấy từ file JSON làm dữ liệu ban đầu)
  const [lessons, setLessons] = useState(data);

  // Modal thêm / sửa
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null); // null = đang thêm mới

  // Modal xoá
  const [showDelete, setShowDelete] = useState(false);
  const [deletingLesson, setDeletingLesson] = useState(null);

  // Thông báo (alert)
  const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });

  // Hiện alert rồi tự ẩn sau 3 giây
  const showAlert = (message, variant) => {
    setAlert({ show: true, message: message, variant: variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "success" });
    }, 3000);
  };

  // ----- THÊM -----
  const handleAddClick = () => {
    setEditingLesson(null);
    setShowForm(true);
  };

  // ----- SỬA -----
  const handleEditClick = (lesson) => {
    setEditingLesson(lesson);
    setShowForm(true);
  };

  // Khi bấm Save changes trong form (dùng chung cho thêm và sửa)
  const handleSave = (values) => {
    if (editingLesson === null) {
      // Thêm mới: tạo id mới
      const newLesson = { ...values, id: String(Date.now()) };
      setLessons([...lessons, newLesson]);
      showAlert("Add lesson successfully!", "success");
    } else {
      // Sửa: thay bài có id trùng bằng dữ liệu mới
      const newList = lessons.map((item) =>
        item.id === editingLesson.id ? { ...values, id: item.id } : item
      );
      setLessons(newList);
      showAlert("Update lesson successfully!", "success");
    }
    setShowForm(false);
  };

  // ----- XOÁ -----
  const handleDeleteClick = (lesson) => {
    setDeletingLesson(lesson);
    setShowDelete(true);
  };

  const handleConfirmDelete = () => {
    const newList = lessons.filter((item) => item.id !== deletingLesson.id);

    if (newList.length < lessons.length) {
      setLessons(newList);
      showAlert("Delete lesson successfully!", "success");
    } else {
      showAlert("Delete lesson failed!", "danger");
    }
    setShowDelete(false);
  };

  return (
    <>
      <nav className="navbar-custom">
        <a href="#">Home</a>
        <a href="#">Lesson Management</a>
        <a href="#">Completed Lesson</a>
      </nav>

      <Container className="mt-4">
        <h1 className="mb-4">Lesson List</h1>

        {alert.show && (
          <Alert
            variant={alert.variant}
            onClose={() => setAlert({ ...alert, show: false })}
            dismissible
          >
            {alert.message}
          </Alert>
        )}

        <div className="text-end mb-3">
          <Button variant="primary" size="lg" onClick={handleAddClick}>
            Add Lesson
          </Button>
        </div>

        <LessonTable
          lessons={lessons}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Container>

      <LessonFormModal
        show={showForm}
        lesson={editingLesson}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
      />

      <DeleteModal
        show={showDelete}
        lesson={deletingLesson}
        onClose={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default App;
