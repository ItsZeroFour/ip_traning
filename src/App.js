import { useState } from "react";
import TaskGenerator from "./components/TaskGenerator";
import AnswerInput from "./components/AnswerInput";
import Feedback from "./components/Feedback";
import SolutionViewer from "./components/SolutionViewer";
import Instructions from "./components/Instructions";

function App() {
  const [currentTask, setCurrentTask] = useState(null);
  const [userAnswers, setUserAnswers] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleAnswerSubmit = (answers) => {
    setUserAnswers(answers);
    console.log("Ответы пользователя:", answers);
  };

  const handleNewTask = (task) => {
    setCurrentTask(task);
    setUserAnswers(null);
    setShowSolution(false);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="wrapper">
          <div className="main__block">
            <h1>Тренажер по IP адресации</h1>

            <Instructions />

            <TaskGenerator onNewTask={handleNewTask} />

            {currentTask && (
              <>
                <AnswerInput task={currentTask} onSubmit={handleAnswerSubmit} />
                {userAnswers && (
                  <Feedback task={currentTask} userAnswers={userAnswers} />
                )}

                <button onClick={() => setShowSolution(!showSolution)}>
                  {showSolution ? "Скрыть решение" : "Показать решение"}
                </button>

                {showSolution && <SolutionViewer task={currentTask} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
