import React from "react";
import { Button } from "@/components/ui/button";
import styles from "../../styles/CreateNewModal.module.css";

interface CreateNewModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

/**
 * CreateNewModal component for adding a new SE method or claim
 */
const CreateNewModal: React.FC<CreateNewModalProps> = ({
  title,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = React.useState<string>("");

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{title}</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter name"
          className={styles.modalInput}
        />
        <div>
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewModal;
