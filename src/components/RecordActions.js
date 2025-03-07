import React, { useState } from "react";

const RecordActions = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bouton des trois points */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-200 focus:outline-none"
      >
        &#8942; {/* Unicode pour trois points verticaux */}
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-700"
          >
            Modifier
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordActions;
