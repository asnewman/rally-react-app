import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import { useQuery } from "react-query";

const RallyPageDiv = styled.div``;

type RallyPageProps = {
  id: string;
};

const rallyQuerySchema = yup.object().shape({
  gameName: yup.string().required(),
});

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

  if (rallyQuery.isLoading || !rallyQuery.data) return <p>Loading...</p>;
  else if (rallyQuery.isError) {
    return <p>Error {rallyQuery.error.message}</p>;
  }

  return (
    <RallyPageDiv>
      <h1>Rally {id}</h1>
      <p>{rallyQuery.data.gameName}</p>
    </RallyPageDiv>
  );
};
