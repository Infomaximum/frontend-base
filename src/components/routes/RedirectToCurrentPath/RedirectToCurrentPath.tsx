import { memo } from "react";
import { Navigate, generatePath, useParams } from "react-router";
import { getSavedSessionStoragePath } from "../../../utils";

const RedirectToCurrentPathComponent: React.FC = () => {
  const params = useParams();

  return <Navigate to={generatePath(getSavedSessionStoragePath(), params)} replace={true} />;
};

export const RedirectToCurrentPath = memo(RedirectToCurrentPathComponent);
