import { useState, useEffect, useCallback } from "react";
import TodoItem from "./TodoItem";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);

  const removeTaskWithIndex = (index, isCompleted) => {
    setTasks((currentValue) => {
      const updatedArray = currentValue.filter((_, i) => i !== index);
      return updatedArray;
    });

    if (isCompleted) {
      setCompletedTasks((currentValue) =>
        currentValue.filter((completedIndex) => completedIndex !== index)
      );
    }
  };

  const updateTaskStatus = useCallback(() => {
    const currentDate = new Date();
    const updatedTasks = tasks.map((task, index) => {
      const deadlineDate = new Date(task.deadline);

      // Check if the task is completed based on the checkbox
      const isCompleted = completedTasks.includes(index);

      if (isCompleted) {
        return { ...task, status: "completed" };
      } else if (deadlineDate < currentDate) {
        return { ...task, status: "overdue" };
      } else {
        return { ...task, status: "pending" };
      }
    });

    setTasks(updatedTasks);
  }, [tasks, completedTasks]);

  const handleButtonClick = () => {
    if (!currentTask.trim() || !deadline) {
      // Validate that both task and deadline are provided
      console.log("Task and deadline are required!");
      return;
    }

    const newTask = {
      text: currentTask,
      deadline: new Date(deadline.replace("T", " ")),
      completed: false, // Initial completion status is set to false
    };

    // Use the functional form of setTasks to ensure the latest state
    setTasks((currentValue) => [...currentValue, newTask]);

    // Call updateTaskStatus after setting the new tasks
    setCurrentTask("");
    setDeadline("");
  };

  useEffect(() => {
    // Call updateTaskStatus on component mount and when tasks or completedTasks change
    updateTaskStatus();
  }, [tasks, completedTasks, updateTaskStatus]);

  // Sort tasks based on deadlines before rendering
  const sortedTasks = tasks.slice().sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  return(
    <main className="text-center bg-black min-h-screen">
      <h2 className="text-white text-3xl font-bold py-5 item-center background-blue-100 ">TASK MANAGER</h2>
      <div className="border-2 border-white p-4 max-w-lg mx-auto rounded-md text-center bg-purple-500 min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            placeholder="Add A New Task"
            className="p-4 w-48 border border-purple-700 rounded-md mb-3 hover:translate-y-1 hover:shadow-xl hover:shadow-black transition-all"
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-4 border border-purple-700 rounded-md mb-3 hover:translate-y-1 hover:shadow-xl hover:shadow-black transition-all"
          />
          <button
            onClick={handleButtonClick}
            className="bg-gray-700 text-white p-4 border border-white rounded-md mb-3 hover:translate-y-1 hover:shadow-xl hover:shadow-black transition-all"
          >
            ADD
          </button>
        </div>
        <ol id="taskList" className="space-y-3 p-6 max-w-lg mx-auto">
          {sortedTasks.map((task, index) => (
            <TodoItem
              key={index}
              todo={task.text}
              removeTaskWithIndex={() => removeTaskWithIndex(index, task.completed)}
              index={index}
              status={task.status}
              deadline={task.deadline} // Pass deadline to TodoItem
              completed={completedTasks.includes(index)} // Pass completion status to TodoItem
            />
          ))}
          </ol>
          </div>
        <ol id="taskList" className="space-y-3 p-6 max-w-lg mx-auto">
        </ol>
      </div>
    </main>
  );
};
export default App;

