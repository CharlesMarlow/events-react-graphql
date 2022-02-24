import React from 'react';
import EventItem from './EventItem/EventItem';
import './eventsList.css';

const EventsList = (props) => {
  const eventsToRender = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        event={event}
        userId={props.authUserId}
        onDetailsClick={props.onViewDetails}
      />
    );
  });

  return <ul className='events__list'>{eventsToRender}</ul>;
};

export default EventsList;
