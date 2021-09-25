import React from "react";
import { Router } from "./Router";
import { QueryClient, QueryClientProvider } from "react-query";
import styled, {createGlobalStyle} from "styled-components";
import "./Fonts.css";
const queryClient = new QueryClient({});

const GlobalStyle = createGlobalStyle`
  html {
    background-color: #30333a;
    color: #fff;
    font-size: 24px;
  }
`;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
