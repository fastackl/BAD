import React, { useState } from 'react';

interface SliderProps {
  defaultValue: number;
  maxValue: number;
  step: number;
}

const Slider: React.FC<SliderProps> = ({ defaultValue, maxValue, step }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return (
    <div className='flex flex-col center text-white gap-2'>
      <style jsx>{`
  input[type='range']::-webkit-slider-runnable-track {
    background: black;
    border-radius: 100px;
  }
  input[type='range']::-webkit-slider-thumb {
    background: white !important;
  }
`}</style>
<input
  type="range"
  min="1"
  max={maxValue}
  step={step}
  value={value}
  onChange={handleChange}
  className="w-full focus:outline-none bg-white"
/>
      <p className='text-xs'>Points to use: {value}</p>
    </div>
  );
};

export default Slider;
