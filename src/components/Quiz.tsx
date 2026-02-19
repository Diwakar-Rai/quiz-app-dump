import { useEffect } from "react";
import { ExamGuard } from "../examGuard/exampGuard";

const Quiz = () => {
  useEffect(() => {
    const guard = new ExamGuard({
      maxScore: 20,
      idleTimeoutMs: 60000,
      autoSubmit: () => {},
      violationWeights: {
        TAB_SWITCH: 5,
        EXIT_FULLSCREEN: 8,
        DEVTOOLS_OPEN: 10,
        ESCAPE_PRESSED: 2,
        WINDOW_BLUR: 3,
        DEVTOOLS_SHORTCUT: 10,
        BACK_BUTTON: 5,
        IDLE: 2,
      },
    });

    guard.start();

    return () => guard.stop();
  }, []);

  return <div>This is quiz</div>;
};

export default Quiz;
