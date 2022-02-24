# Create event

mutation {
 	createEvent(eventInput: {
    title:"Radiohead Live"
    description: "The legends are coming to Europe's capital"
    price: 100.0
    date: "2022-01-25T11:03:28.796Z"
  }) 
  {
    _id
    title
    description
    price
    date
  }
}

# Create user
mutation {
  createUser(userInput: {
    email: "testo@test.com"
    password: "123456"
  })
  {
    _id
    email
  }
}

# Get all events

query {
  events {
    _id
    title
    description
    price
    date
    creator  {
      email
      createdEvents {
        title
        description
        date
        price
        _id
      }
    }
  }
}

# Get all bookings

query {
  bookings {
    _id
    createdAt
    updatedAt
    event {
      title
      description
      creator {
        email
      }
    }
    user {
      email
    }
  }
}

# Book event 

mutation {
  bookEvent(eventId: <ID>) {
    _id
    createdAt
    user {
      _id
      email
    }
  }
}

# Cancel booking

mutation {
  cancelBooking(bookingId: <ID>) {
    title
    description
    creator {
      email
    }
  }
}

# Login

{
  login(email: "test@test.com", password: "123456") {
    userId
    token
    tokenExpiration
  }
}
