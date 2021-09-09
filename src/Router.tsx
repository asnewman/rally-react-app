// Custom router because I don't want to use a package

import React from "react";

export class Success<DataType> {
  constructor(data: DataType) {
    this.data = data;
  }

  data: DataType;
}

export class Failure {
  constructor(error: Error) {
    this.error = error;
  }

  error: Error;
}


export type Route = {
  url: string;
  component: React.ReactElement;
};

const routes: Route[] = [
  {url: "/", component: <div>Rally Home</div>},
  {url: "/rally/:id", component: <div>Rally id: </div>},
];

type RouterProps = {
  routes?: Route[],
  path?: string
}

const Router = ({ routes = routes, path = window.location.path }: RouterProps) => {
  let foundRoute = 
  
  for (const route of routes) {
    route.
  }
}


type ComparePathResult = {
  doesMatch: boolean;
  slugs: Record<string, string>;
}

export const comparePath = (declaredPath: string, urlPath: string): Success<ComparePathResult> | Failure => {
  const declaredPathWords = declaredPath.split("/");
  const urlPathWords = urlPath.split("/");

  const slugs: Record<string, string> = {};

  if (declaredPathWords.length !== urlPathWords.length) return new Success({doesMatch: false, slugs: {}});

  for (let wordIdx = 0; wordIdx < declaredPathWords.length; wordIdx++) {
    if ((declaredPathWords[wordIdx] !== urlPathWords[wordIdx]) && declaredPathWords[wordIdx].charAt(0) !== ":") {
      return new Success({doesMatch: false, slugs: {}});
    }

    if (declaredPathWords[wordIdx].charAt(0) === ":") {
      const slugKeyword = declaredPathWords[wordIdx].substring(1)

      if (slugs[slugKeyword]) {
        return new Failure(new Error('`Error parsing url, multiple same slug keywords found: ${declaredPathWords}`'));
      }

      slugs[slugKeyword] = urlPathWords[wordIdx];
    }
  }

  return new Success({doesMatch: true, slugs});
}
