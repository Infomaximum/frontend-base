import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWillMountEffect } from "@infomaximum/base/src/decorators/hooks/useWillMountEffect";
import { historyStore } from "@infomaximum/base/src/store/historyStore";
import { SystemLoaderProvider } from "../SystemLoaderProvider/SystemLoaderProvider";
import {
  SystemLoaderContext,
  type TSystemLoaderContextValue,
} from "@infomaximum/base/src/decorators/contexts/SystemLoaderContext";
import { noop } from "lodash";

interface ISystemInitializerProps {
  children: React.ReactNode;
}

const SystemInitializer: FC<ISystemInitializerProps> = ({ children }) => {
  const [isLoading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useWillMountEffect(() => {
    historyStore.navigate = navigate;
    historyStore.location = location;
  });

  useEffect(() => {
    historyStore.navigate = navigate;
  }, [navigate]);

  useEffect(() => {
    historyStore.location = location;
  }, [location]);

  const hideSystemLoader = useCallback(() => {
    const spinner = document.getElementById("spinner-wrapper");

    if (spinner) {
      // Убираем спиннер который отображается до загрузки системы
      spinner.style.display = "none";

      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(
    () =>
      ({
        hideSystemLoader,
        showSystemLoader: noop,

        isLoading: () => isLoading,
      }) satisfies TSystemLoaderContextValue,
    [hideSystemLoader, isLoading]
  );

  return (
    <SystemLoaderContext.Provider value={contextValue}>
      <SystemLoaderProvider>{children}</SystemLoaderProvider>
    </SystemLoaderContext.Provider>
  );
};

export { SystemInitializer };
