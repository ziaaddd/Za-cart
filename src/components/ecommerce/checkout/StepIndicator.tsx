import styles from "./StepIndicator.module.css";

interface IStepIndicatorProps {
  currentStep: 0 | 1 | 2; // Strict typing matches your TStep
}

const STEPS = ["Shipping", "Review", "Confirmation"] as const;

const StepIndicator = ({ currentStep }: IStepIndicatorProps) => (
  <div
    className={`d-flex align-items-center justify-content-center mb-5 ${styles.stepper}`}
  >
    {STEPS.map((label, i) => {
      const isDone = i < currentStep;
      const isActive = i === currentStep;
      return (
        <div key={label} className="d-flex align-items-center">
          <div className="d-flex flex-column align-items-center">
            <div
              className={[
                "rounded-circle d-flex align-items-center justify-content-center fw-bold",
                isDone ? "bg-success text-white" : "",
                isActive ? "bg-info text-white" : "",
                !isDone && !isActive ? "bg-light text-muted border" : "",
                styles.stepCircle,
              ].join(" ")}
            >
              {isDone ? "✓" : i + 1}
            </div>
            <span
              className={`mt-1 small fw-semibold ${isActive ? "text-info" : isDone ? "text-success" : "text-muted"}`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`${styles.stepLine} ${isDone ? "bg-success" : "bg-light border-top"}`}
            />
          )}
        </div>
      );
    })}
  </div>
);

export default StepIndicator;
