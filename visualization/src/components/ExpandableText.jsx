import React, { useState } from 'react';

const ExpandableText = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <button
        className="w-full h-full bg-blue-500 text-white rounded-md"
        onClick={toggleText}
      >
        Button
      </button>

      {isExpanded && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-md shadow-md">
          <p className="text-gray-800">
            Este es el texto que se despliega de forma flotante justo debajo del botón.
          </p>
          <button
            className="mt-4 px-2 py-1 bg-blue-500 text-white rounded-md"
            onClick={toggleText}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpandableText;
