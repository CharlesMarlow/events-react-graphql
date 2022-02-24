import React, { useState, useContext, useEffect } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/AuthContext';
import EventsList from '../components/Events/EventsList/EventsList';
import './events.css';

const Events = () => {
  const authContext = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      await fetchEvents();
    };
    getEvents();
  }, []);

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
                _id
                email
            }
          }
        }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed fetching events');
        }

        return res.json();
      })
      .then((data) => {
        setEvents(data.data.events);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const modalConfirmHandler = () => {
    setCreating(false);

    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0
    ) {
      return;
    }

    const priceAsNum = +price;

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: { title: "${title}", description: "${description}", price: ${priceAsNum}, date: "${date}" }) {
            _id
            title
            description
            price
            date
            creator {
                _id
                email
            }
          }
        }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authContext.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed creating an event');
        }

        return res.json();
      })
      .then((data) => {
        setEvents((prevEvents) => {
          const updatedEvents = [...prevEvents];
          updatedEvents.push({
            id: data.data.createEvent._id,
            title: data.data.createEvent.title,
            description: data.data.createEvent.description,
            price: data.data.createEvent.price,
            date: data.data.createEvent.date,
            creator: {
              _id: authContext.userId,
            },
          });

          setEvents(updatedEvents);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onPriceChange = (e) => {
    setPrice(e.target.value);
  };

  const onDateChange = (e) => {
    setDate(e.target.value);
  };

  const showDetailsHandler = (eventId) => {
    setSelectedEvent((prevSelectedEvent) => {
      const selectedEvent = events.find((event) => event._id === eventId);
      setSelectedEvent(selectedEvent);
    });
  };

  const bookEventHandler = () => {
    if (!authContext.token) {
      setSelectedEvent(null);
      return;
    }
    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            createdAt
            updatedAt
            }
          }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authContext.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed to book an event');
        }

        return res.json();
      })
      .then((data) => {
        console.log('Book Event Data: ', data);
        setSelectedEvent(null);
      })
      .catch((err) => {
        console.error('Book Event Error: ', err);
      });
  };

  return (
    <>
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title='Add event'
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText={"Confirm"}
        >
          <form>
            <div className='form-control'>
              <label htmlFor='title'>Title</label>
              <input
                type={'text'}
                id='title'
                value={title}
                onChange={(e) => onTitleChange(e)}
              />
            </div>
            <div className='form-control'>
              <label htmlFor='description'>Description</label>
              <textarea
                rows='4'
                id='description'
                value={description}
                onChange={(e) => onDescriptionChange(e)}
              ></textarea>
            </div>
            <div className='form-control'>
              <label htmlFor='price'>Price</label>
              <input
                type={'number'}
                id='price'
                value={price}
                onChange={(e) => onPriceChange(e)}
              />
            </div>
            <div className='form-control'>
              <label htmlFor='date'>Date</label>
              <input
                type={'datetime-local'}
                id='date'
                value={date}
                onChange={(e) => onDateChange(e)}
              />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={authContext.token ? "Book" : 'Confirm'}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{' '}
            {new Date(selectedEvent.date).toLocaleDateString('en-GB')}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {authContext.token && (
        <div className='events-control'>
          <p>Share your own events!</p>
          <button className='btn' onClick={startCreateEventHandler}>
            Create event
          </button>
        </div>
      )}
      {isLoading ? (
        <div className='spinner'>
          <div className='lds-circle'>
            <div></div>
          </div>
        </div>
      ) : (
          <EventsList
            events={events}
            authUserId={authContext.userId}
            onViewDetails={showDetailsHandler}
          />
      )}
    </>
  );
};

export default Events;
