import { useState, forwardRef } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

type Props = React.ComponentProps<typeof Form.Control>;

const PasswordInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup hasValidation>
      <Form.Control {...props} ref={ref} type={visible ? "text" : "password"} />
      <Button
        variant="outline-info"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
      >
        {visible ? "🙈" : "👁️"}
      </Button>
    </InputGroup>
  );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
