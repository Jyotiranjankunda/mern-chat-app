import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';

const Register = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      const { username, email, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      
      if(data.status === false){
        toast.error(data.msg, toastOptions);
      }

      if(data.status === true){
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      toast.error('Enter a valid email.', toastOptions);
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match.", toastOptions);
      return false;
    }

    if (password.length < 8) {
      toast.error('Password must be at least of 8 characters.', toastOptions);
      return false;
    }

    if (username.length < 3) {
      toast.error('Username length must be greater than 3', toastOptions);
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
            <img src={Logo} alt='Logo' />
            <h1>Chat Ninja</h1>
          </div>
          <input
            type='text'
            placeholder='Username'
            name='username'
            onChange={(e) => handleChange(e)}
          />
          <input
            type='email'
            placeholder='Email'
            name='email'
            onChange={(e) => handleChange(e)}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={(e) => handleChange(e)}
          />
          <input
            type='password'
            placeholder='Confirm Password'
            name='confirmPassword'
            onChange={(e) => handleChange(e)}
          />

          <button type='submit'>Register</button>
          <span>
            Already have an account? <Link to={'/login'}>Login</Link>
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

export default Register;
