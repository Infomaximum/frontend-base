import React from "react";
import { generatePath } from "react-router-dom";
import Redirect from "src/components/routes/Redirect/Redirect";
import { useParams } from "react-router";

export const withRedirect = (redirectPath: string) => () => {
  const params = useParams();

  return <Redirect to={generatePath(redirectPath, params)} />;
};
