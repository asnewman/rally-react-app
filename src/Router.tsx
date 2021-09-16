// Custom router because I don't want to use a package

import React from "react";
import { Failure, Success } from "./Utility";
import { RallyPage } from "./Pages/RallyPage";

export type Route = {
  path: string;
  component: React.FC<Record<string, string>>;
};

const routes: Route[] = [
  { path: "/", component: () => <div>Rally Home</div> },
  { path: "/rally/:id", component: (props) => <RallyPage id={props.id} /> },
];

export const Router: React.FC = () => {
  const { pathname } = window.location;
  let comparePathRes: Success<ComparePathResult> | Failure | undefined;

  let routeIdx;
  for (routeIdx = 0; routeIdx < routes.length; routeIdx++) {
    comparePathRes = comparePath(routes[routeIdx].path, pathname);

    if (
      (comparePathRes instanceof Success && comparePathRes.data.doesMatch) ||
      comparePathRes instanceof Failure
    ) {
      break;
    }
  }

  if (comparePathRes instanceof Failure) {
    const { error } = comparePathRes;
    return <p>{{ error }}</p>;
  } else if (!comparePathRes || !comparePathRes.data.doesMatch) {
    return <p>404 path not found</p>;
  } else {
    return routes[routeIdx].component(comparePathRes.data.slugs);
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
            `Error parsing url, multiple same slug keywords found: ${declaredPathWords}`
          )
        );
      }

      slugs[slugKeyword] = urlPathWords[wordIdx];
    }
  }

  return new Success({ doesMatch: true, slugs });
};
