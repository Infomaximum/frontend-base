import { useMemo, type FC } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

interface IBrowserRouterProps {
  children: React.ReactNode;
  basename: string;
}

const future = { v7_startTransition: true };

export const BrowserRouter: FC<IBrowserRouterProps> = ({ children, basename }) => {
  const browserRouter = useMemo(() => {
    return createBrowserRouter(
      [
        {
          path: "*",
          element: children,
        },
      ],
      { basename }
    );
  }, [basename, children]);

  return <RouterProvider router={browserRouter} future={future} />;
};
