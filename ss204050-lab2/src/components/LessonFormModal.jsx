import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

// Luật kiểm tra dữ liệu (Yup)
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

// Giá trị rỗng khi thêm mới
const emptyLesson = {
  lessonTitle: "",
  lessonImage: "",
  estimatedTime: 0,
  level: "",
  isCompleted: false,
};

function LessonFormModal({ show, lesson, onClose, onSave }) {
  // lesson = null  -> đang thêm mới
  // lesson có dữ liệu -> đang sửa
  const isEdit = lesson !== null;

  let startValues = emptyLesson;
  if (isEdit) {
    startValues = lesson;
  }

  const formik = useFormik({
    initialValues: startValues,
    // Đổi bài cần sửa thì form tự nạp lại dữ liệu của bài đó
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      const lessonData = {
        ...values,
        estimatedTime: Number(values.estimatedTime), // ô input trả về chuỗi, đổi sang số
      };
      onSave(lessonData);
      formik.resetForm(); // lưu xong thì làm sạch form
    },
  });

  // Đóng modal: xoá dữ liệu đang nhập và lỗi, rồi báo cho App đóng
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit Lesson" : "Add Lesson"}</Modal.Title>
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default LessonFormModal;
