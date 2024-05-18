import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Buffer } from 'buffer';
import { setAvatarRoute } from '../utils/APIRoutes';
// import { randomImages } from '../utils/randomImages.js';

export default function SetAvatar() {
  // const api = `https://api.multiavatar.com/45678945`;
  const api = `https://api.multiavatar.com`;

  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: 'top-right',
    autoClose: 5000,
    pauseOnHover: true,
    theme: 'dark',
  };

  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login');
    }
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error('Please select an avatar', toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem('chat-app-user'));

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('chat-app-user', JSON.stringify(user));
        navigate('/');
      } else {
        toast.error('Error setting avatar. Please try again.', toastOptions);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const data = [];
      // const usedIds = new Set();

      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.random().toString(36).slice(2)}?apiKey=${
            import.meta.env.VITE_API_KEY
          }`,
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString('base64'));
      }

      // while (data.length < 4) {
      //   const randomId = Math.floor(Math.random() * 50) + 1;
      //   if (randomImages[randomId] && !usedIds.has(randomId)) {
      //     data.push(randomImages[randomId]);
      //     usedIds.add(randomId);
      //   }
      // }
      setAvatars(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <ToastContainer />
      {isLoading ? (
        <Container>
          <img src={loader} alt='loader' className='loader' />
        </Container>
      ) : (
        <Container>
          <div className='title-container'>
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className='avatars'>
            {avatars.map((avatar, index) => {
              // console.log(avatar);
              // const path = `"${avatar}"`;
              // console.log(path);
              return (
                <div
                  className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}
                  key={avatar}>
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt='avatar'
                    onClick={() => setSelectedAvatar(index)}
                  />
                  {/* <img
                    src={path}
                    alt={`Avatar ${index + 1}`}
                    onClick={() => setSelectedAvatar(index)}
                  /> */}
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className='submit-btn'>
            Set as Profile Picture
          </button>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
