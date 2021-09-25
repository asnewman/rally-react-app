import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import { useQuery } from "react-query";
import User from "components/User";

type RallyPageProps = {
  id: string;
};

const rallyUserSchema = yup
  .object()
  .shape({
    username: yup.string().required(),
    avatarURL: yup.string().required(),
  })
  .required();

const rallyQuerySchema = yup
  .object()
  .shape({
    id: yup.string().required(),
    gameName: yup.string().required(),
    author: rallyUserSchema,
    users: yup.array().of(rallyUserSchema),
    userCount: yup.number().required(),
  })
  .required();

const getRallyId = async (
  id: string
): Promise<yup.TypeOf<typeof rallyQuerySchema>> => {
  const response = await fetch(
    `https://rallydiscordbot.herokuapp.com/api/rally/${id}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch rally data for ${id}`);
  }

  const data = await response.json();
  const isDataValid = rallyQuerySchema.isValidSync(data);

  if (isDataValid) return data;
  else throw new Error(`Rally data for ${id} mis-formed`);
};

export const RallyPage: React.FC<RallyPageProps> = ({ id }) => {
  const rallyQuery = useQuery<yup.TypeOf<typeof rallyQuerySchema>, Error>(
    ["rally", id],
    () => getRallyId(id)
  );

  const { data } = rallyQuery;

  if (rallyQuery.isLoading || !data) return <p>Loading...</p>;
  else if (rallyQuery.isError) {
    return <p>Error {rallyQuery.error.message}</p>;
  }

  return (
    <RallyPageDiv>
      <>
        <Title>Rally #{data.id.slice(data.id.length - 5)}</Title>
        <p>
          Created by{" "}
          <User
            username={data.author.username}
            avatarUrl={data.author.avatarURL}
          />{" "}
          who is seeking recruits for{" "}
          <StyledGameName>{data.gameName}</StyledGameName>.
        </p>
        <p>Current recruits {data.users.length}/{data.userCount}:</p>
        <Recruits>
          {data.users.map((user: yup.TypeOf<typeof rallyUserSchema>) => {
            return (
              <UserWrapper>
                <User username={user.username} avatarUrl={user.avatarURL} />
              </UserWrapper>
            );
          })}
        </Recruits>
      </>
    </RallyPageDiv>
  );
};

const Title = styled.h1`
  font-family: "Bowlby One", serif;
`;

const StyledGameName = styled.span`
  font-family: "Bowlby One", sans-serif;
`;

const RallyPageDiv = styled.div`
  margin: 0 20px;
`;

const Recruits = styled.div`
  background-color: gray;
  padding: 5px;
  border-radius: 5px;
  display: inline-block;
`;

const UserWrapper = styled.div`
  display: block;
  padding: 5px;
  width: 300px;
  background-color: lightgray;
  color: black;
  margin-bottom: 5px;
  border-radius: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;
