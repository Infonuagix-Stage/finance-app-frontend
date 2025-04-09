import React, { useState } from "react";
import styles from './RecordActions.module.css';

interface RecordActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const RecordActions: React.FC<RecordActionsProps> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.recordActions}>
      {/* Button for actions menu */}
      <button onClick={() => setIsOpen(!isOpen)} className={styles.menuButton}>
        &#8942; {/* Unicode for vertical ellipsis */}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className={styles.dropdownItem}
          >
            Modifier
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className={`${styles.dropdownItem} ${styles.delete}`}
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordActions;
