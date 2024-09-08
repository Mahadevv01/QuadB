import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import "./Task.styles.css";
import { FetchedContext } from "../../../../App";

const Task = ({ value, editTaskBox }) => {
  const { deleteTask, tasks, setTasks, notify, showDescription } = useContext(FetchedContext);
  const [isChecked, setIsChecked] = useState(value.completed);

  // Updating Task Completion
  const handleCheckbox = (id) => {
    setIsChecked(!isChecked);
    fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "PATCH",
      body: JSON.stringify({
        completed: !isChecked,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        let updatedTasks = tasks.map((task) => {
          if (task.id === id) {
            task.completed = !task.completed;
            return task;
          }
          return task;
        });
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        notify(`Task Updated Successfully! Task Moved to ${!isChecked ? 'Completed' : 'Pending'}!`, "success");
      })
      .catch(() => {
        notify("Error Updating Task!", "error");
      });
  };

  const handleDelete = () => {
    deleteTask(value.id);
  };

  const handleEdit = () => {
    editTaskBox(value.id);
  };

  return (
    <div className="task">
      <div className="task-description">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => handleCheckbox(value.id)}
        />
        <div className="task-desc" onClick={() => showDescription(value.id)}>
          <div className="task-heading">{value.title}</div>
        </div>
      </div>
      <div className="task-category">
        {value.category || "Not Set"}
      </div>
      <div className="edit-del-icons">
        <FontAwesomeIcon
          className="edit-task"
          icon={faPenToSquare}
          onClick={handleEdit}
        />
        <FontAwesomeIcon
          className="destroy-task"
          icon={faTrashAlt}
          onClick={handleDelete}
        />
      </div>
    </div>
  );
};

export default Task;
