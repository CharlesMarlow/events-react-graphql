import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import BookingsList from '../components/Bookings/BookingsList/BookingsList';

const Bookings = () => {
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getBookings = async () => {
      await fetchBookings();
    };
    getBookings();
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
                _id
                title
                date
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
          throw new Error('Failed fetching bookings');
        }

        return res.json();
      })
      .then((data) => {
        console.info('FETCH BOOKINGS DATA', data);
        setBookings(data.data.bookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const deleteBookingHandler = (bookingId) => {
    setIsLoading(true);
    const requestBody = {
      query: `
        mutation CancelBooking($bookingId: ID!) {
          cancelBooking(bookingId: $bookingId) {
            _id
            title
          }
        }
      `,
      variables: {
        bookingId: bookingId,
      },
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
          throw new Error('Failed fetching bookings');
        }

        return res.json();
      })
      .then((data) => {
        console.info('CANCEL BOOKING DATA', data);
        setBookings(
          bookings.filter((booking) => {
            return booking._id !== bookingId;
          })
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <div className='spinner'>
          <div className='lds-circle'>
            <div></div>
          </div>
        </div>
      ) : (
        <ul>
          {<BookingsList bookings={bookings} onDelete={deleteBookingHandler} />}
        </ul>
      )}
    </>
  );
};

export default Bookings;
