import { useState } from "react";
import Quiz from "./components/Quiz";

const App = () => {
  const [quiz, setQuiz] = useState(false);
  return (
    <div>
      {quiz ? <Quiz /> : null}
      <button onClick={() => setQuiz(true)}>Take Quiz</button>
    </div>
  );
};

export default App;
