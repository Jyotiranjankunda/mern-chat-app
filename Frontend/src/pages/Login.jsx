import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';

const Login = () => {
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const toastOptions = {
    position: 'top-right',
    autoClose: 5000,
    pauseOnHover: true,
    theme: 'dark',
  };
  

  // If user is already logged in, then redirect to the chat page and it will only happen for the first time, then page loads.
  useEffect(() => {
    if(localStorage.getItem('chat-app-user')){
      navigate('/');
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }

      if (data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        navigate('/');
      }
    }
  };

  const handleValidation = () => {
    const { username, password } = values;
    
    if (password === '') {
      toast.error('Password is required', toastOptions);
      return false;
    }
    
    if (username === '') {
      toast.error('Username is required', toastOptions);
      return false;
    }
    return true;
  };
  
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <ToastContainer />
      <FormContainer>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='brand'>
            <img src={logo} alt='Logo' />
            <h1>Chat Ninja</h1>
          </div>
          <input
            type='text'
            placeholder='Username'
            name='username'
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={(e) => handleChange(e)}
          />

          <button type='submit'>Login</button>
          <span>
            Don&apos;t have an account ? <Link to={'/register'}>Register</Link>
          </span>
        </form>
      </FormContainer>
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    img {
      height: 5rem;
    }

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;

    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;

      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }

    button {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;

      &:hover {
        background-color: #4e0eff;
      }
    }

    span {
      color: white;
      text-transform: uppercase;

      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Login;
