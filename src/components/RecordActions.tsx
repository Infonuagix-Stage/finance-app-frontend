import React, { useState } from "react";
import "./RecordActions.css"; // Import the CSS file

interface RecordActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const RecordActions: React.FC<RecordActionsProps> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="record-actions">
      {/* Button for actions menu */}
      <button onClick={() => setIsOpen(!isOpen)} className="menu-button">
        &#8942; {/* Unicode for vertical ellipsis */}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="dropdown-menu">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="dropdown-item"
          >
            Modifier
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="dropdown-item delete"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordActions;
