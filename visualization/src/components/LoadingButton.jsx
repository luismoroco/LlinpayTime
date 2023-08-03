import React from 'react';

const LoadingButton = () => {
  return (
    <button type="button" className="bg-indigo-500 ..." disabled>
      <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
        {/* ... Aquí coloca el contenido del svg animado ... */}
      </svg>
      Processing...
    </button>
  );
};

export default LoadingButton;