import React from "react";
import styled from "styled-components";

interface UserProps {
  username: string;
  avatarUrl: string;
}

const User: React.FC<UserProps> = ({ username, avatarUrl }) => {
  return (
    <UserDiv>
      <AvatarIcon src={avatarUrl} alt={`${username}'s avatar icon`} />
      <StyledUsername>{username}</StyledUsername>
    </UserDiv>
  );
};

const UserDiv = styled.div`
  * {
    margin-right: 3px;
  }
  
  display: inline-block;
`;

const AvatarIcon = styled.img`
  border-radius: 100px;
  height: 18px;
`;

const StyledUsername = styled.span`
  font-weight: bold;
`;

export default User;