import { FC } from 'react';

interface PointsProps {
  label: string;
}

const Points: FC<PointsProps> = ({ label }) => (
  <div className="flex flex-row center gap-1">
    <p className='text-sm font-bold' role="img" aria-label="emoji">🛡️</p>
    <p className='text-md font-bold'>{label}</p>
  </div>
);

export default Points;

