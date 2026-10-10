import { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import data from "./jlpt_lessons.json";
import LessonTable from "./components/LessonTable";
import LessonFormModal from "./components/LessonFormModal";
import DeleteModal from "./components/DeleteModal";
import LoginModal from "./components/LoginModal";
import "./App.css";
import apisLogin from "./axios/index.Jsx";

function App() {
  // Danh sách bài học (lấy từ file JSON làm dữ liệu ban đầu)
  const [lessons, setLessons] = useState(data);
  const [profile, setProfile] = useState({});

  // Modal thêm / sửa
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null); // null = đang thêm mới

  // Modal xoá
  const [showDelete, setShowDelete] = useState(false);
  const [deletingLesson, setDeletingLesson] = useState(null);

  // Modal đăng nhập
  const [showLogin, setShowLogin] = useState(false);

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

  // ----- ĐĂNG NHẬP -----
  const handleLogin = async (values) => {
    try {
      const { data } = await apisLogin.post("/login", {
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("token", data?.token);
      console.log("Login response:", data);

      const {data:profile} = await apisLogin.get("/profile", {
        headers: { Authorization: `Bearer ${data?.token}` },
      });
      setProfile(profile.user);
      
      setShowLogin(false);
      showAlert(`Login successfully! Welcome ${values.email}`, "success");

      console.log("Profile:", profile.data);
    } catch (error) {
      console.log(error);
      showAlert(
        error.response?.data?.message || "Email or password is incorrect!",
        "danger"
      );
    }
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
{profile.email ? (
  <>
        <span className="profile-info">
          Logged in as: {profile.email}
        </span>
        <Button
          variant="outline-danger"
          className="logout-btn"
          onClick={() =>{ localStorage.removeItem("token") ; setProfile({})}}
          >Logout</Button>
        </>
      ) :
        <Button
          variant="outline-primary"
          className="login-btn"
          onClick={() => setShowLogin(true)}
        >
          Login
        </Button>}
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

      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

export default App;
