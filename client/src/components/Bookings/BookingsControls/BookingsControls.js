import React from 'react';
import './bookingsControl.css';

const BookingsControls = (props) => {
  return (
    <div className='bookings-control'>
      <button
        className={props.activeOutputType === 'list' ? 'active' : ''}
        onClick={() => props.onChangeType('list')}
      >
        List
      </button>
      <button
        className={props.activeOutputType === 'chart' ? 'active' : ''}
        onClick={() => props.onChangeType('chart')}
      >
        Chart
      </button>
    </div>
  );
};

export default BookingsControls;
