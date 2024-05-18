import { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome({currentUser}) {
  // const [userName, setUserName] = useState("");

  // useEffect(() => {
  //   async function setUsername(){
  //     setUserName(
  //       await JSON.parse(
  //         localStorage.getItem("chat-app-user")
  //       ).username
  //     );
  //   }
    
  //   setUsername();
  // }, []);

  return (
    <Container>
      <img src={Robot} alt="Welcome" />
      <h1>
        {/* Welcome, <span>{userName}!</span> */}
        Welcome, <span>{currentUser.username}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
