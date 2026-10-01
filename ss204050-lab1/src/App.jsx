import data from "./jlpt_lessons.json";
import "./App.css";

function App() {
  return (
    <>
      <nav className="navbar">
        <a href="#">Home</a>
        <a href="#">Lesson Management</a>
        <a href="#">Completed Lesson</a>
      </nav>

      <div className="container">
        <h1>All Available Lessons</h1>

        <div className="lesson-grid">
          {data.map((item, index) => (
            <div className="lesson-card" key={index}>
              <img
                src={item.lessonImage}
                alt={item.lessonTitle}
                className="lesson-image"
              />

              <div className="lesson-content">
                <h2 className="lesson-title">
                  {item.lessonTitle}
                </h2>

                <p>
                  <b>Level:</b> {item.level}
                </p>

                <p>
                  <b>Estimated Time:</b>{" "}
                  {item.estimatedTime} mins
                </p>

                <span
                  className={
                    item.isCompleted
                      ? "completed"
                      : "not-completed"
                  }
                >
                  {item.isCompleted
                    ? "Completed"
                    : "Not Completed"}
                </span>

                <button className="view-detail-btn">
                  View Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;