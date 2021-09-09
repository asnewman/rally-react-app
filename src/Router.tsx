// Custom router because I don't want to use a package

import React from "react";
import { Failure, Success } from "./Utility";

export type Route = {
  path: string;
  component: React.ReactElement;
};

const routes: Route[] = [
  { path: "/", component: <div>Rally Home</div> },
  { path: "/rally/:id", component: <div>Rally id: </div> },
];

export const Router: React.FC = () => {
  const { pathname } = window.location;
  let foundRoute: Success<ComparePathResult> | Failure | undefined;

  let routeIdx;
  for (routeIdx = 0; routeIdx < routes.length; routeIdx++) {
    foundRoute = comparePath(routes[routeIdx].path, pathname);

    if (
      (foundRoute instanceof Success && foundRoute.data.doesMatch) ||
      foundRoute instanceof Failure
    ) {
      break;
    }
  }

  if (foundRoute instanceof Failure) {
    const { error } = foundRoute;
    return <p>{{ error }}</p>;
  } else if (!foundRoute || !foundRoute.data.doesMatch) {
    return <p>404 path not found</p>;
  } else {
    return routes[routeIdx].component;
  }
};

type ComparePathResult = {
  doesMatch: boolean;
  slugs: Record<string, string>;
};

export const comparePath = (
  declaredPath: string,
  urlPath: string
): Success<ComparePathResult> | Failure => {
  const declaredPathWords = declaredPath.split("/");
  const urlPathWords = urlPath.split("/");

  const slugs: Record<string, string> = {};

  if (declaredPathWords.length !== urlPathWords.length)
    return new Success({ doesMatch: false, slugs: {} });

  for (let wordIdx = 0; wordIdx < declaredPathWords.length; wordIdx++) {
    if (
      declaredPathWords[wordIdx] !== urlPathWords[wordIdx] &&
      declaredPathWords[wordIdx].charAt(0) !== ":"
    ) {
      return new Success({ doesMatch: false, slugs: {} });
    }

    if (declaredPathWords[wordIdx].charAt(0) === ":") {
      const slugKeyword = declaredPathWords[wordIdx].substring(1);

      if (slugs[slugKeyword]) {
        return new Failure(
          new Error(
            "`Error parsing url, multiple same slug keywords found: ${declaredPathWords}`"
          )
        );
      }

      slugs[slugKeyword] = urlPathWords[wordIdx];
    }
  }

  return new Success({ doesMatch: true, slugs });
};
