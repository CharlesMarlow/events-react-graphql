import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './auth.css';

const Auth = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (!isLogin) {
      requestBody = {
        query: `
        mutation {
          createUser(userInput: { email: "${email}", password: "${password}" }) {
            _id
            email
          }
        }
      `,
      };
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed creating a user');
        }

        return res.json();
      })
      .then((data) => {
        navigate("/events");
        if (data.data.login.token) {
          authContext.login(data.data.login.token, data.data.login.userId, data.data.login.tokenExpiration);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const switchModeHandler = () => {
    setIsLogin(!isLogin)
  };

  return (
    <form className='auth-form' onSubmit={onFormSubmit}>
      <div className='form-control'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => onEmailChange(e)}
        />
      </div>
      <div className='form-control'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => onPasswordChange(e)}
        />
      </div>
      <div className='form-actions'>
        <button type='submit' onClick={onFormSubmit}>
          Submit
        </button>
        <button type='button' onClick={switchModeHandler}>
          Switch to {isLogin ? 'sign up' : 'login'}
        </button>
      </div>
    </form>
  );
};

export default Auth;
