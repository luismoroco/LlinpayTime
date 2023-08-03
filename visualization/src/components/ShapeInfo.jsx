import React from 'react';
import Select from 'react-select';
import { CheckCircleIcon } from '@heroicons/react/solid';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#4F46E5' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px #4F46E5' : provided.boxShadow,
    '&:hover': {
      borderColor: '#4F46E5',
    },
  }),
}; 

const options = [
  { value: 'option1', label: <CheckCircleIcon className="w-5 h-5" /> },
  { value: 'option2', label: <CheckCircleIcon className="w-5 h-5" /> },
  { value: 'option3', label: <CheckCircleIcon className="w-5 h-5" /> },
];

const IconSelect = () => {
  return (
    <div className="w-48">
      <Select
        options={options}
        styles={customStyles}
        isSearchable={false}
      />
    </div>
  );
};

export default IconSelect;
