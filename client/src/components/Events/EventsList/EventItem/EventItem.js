import React from 'react';
import './eventItem.css';

const EventItem = (props) => {
  const { event, userId } = props;
  const isCurrentUser = userId === event.creator._id;
  return (
    <li key={event._id} className='events__list-item'>
      <div>
        <h1>{event.title}</h1>
        <h2>
          ${event.price} - {new Date(event.date).toLocaleDateString('en-GB')}
        </h2>
      </div>
      <div>
        {isCurrentUser ? (
          <p>You're the event owner</p>
        ) : (
          <button
            className='btn'
            onClick={() => props.onDetailsClick(event._id)}
          >
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
