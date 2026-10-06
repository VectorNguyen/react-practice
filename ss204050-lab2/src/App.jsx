import { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import data from "./jlpt_lessons.json";
import LessonTable from "./components/LessonTable";
import LessonFormModal from "./components/LessonFormModal";
import DeleteModal from "./components/DeleteModal";
import "./App.css";

function App() {
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

  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Bấm "Save changes" trong form (dùng chung cho thêm và sửa)
  const handleSave = (values) => {
    if (editingLesson === null) {
      // Thêm mới: tạo id mới bằng thời gian hiện tại để không bị trùng
      const newLesson = { ...values, id: String(Date.now()) };
      setLessons([...lessons, newLesson]);
      showAlert("Add lesson successfully!", "success");
    } else {
      // Sửa: bài nào trùng id thì thay bằng dữ liệu mới
      const newList = lessons.map((item) => {
        if (item.id === editingLesson.id) {
          return { ...values, id: item.id };
        }
        return item;
      });
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

  return (
    <>
      <nav className="navbar-custom">
        <a href="#">Home</a>
        <a href="#">Lesson Management</a>
        <a href="#">Completed Lesson</a>
      </nav>

      <Container className="mt-4">
        <h1 className="mb-4">Lesson List</h1>

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

        <LessonTable
          lessons={lessons}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Container>

      <LessonFormModal
        show={showForm}
        lesson={editingLesson}
        onClose={handleCloseForm}
        onSave={handleSave}
      />

      <DeleteModal
        show={showDelete}
        lesson={deletingLesson}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default App;
