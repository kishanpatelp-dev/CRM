import { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskFilterBar from "../components/TaskFilterBar";

export default function ProjectTasks({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/tasks`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task._id !== id));
  };

  if (loading) return <p className="text-center">Loading tasks...</p>;

  return (
    <div className="p-4 space-y-4">
      <TaskFilterBar />
      <TaskForm projectId={projectId} onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
