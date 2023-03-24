import { type FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMountEffect } from "../../decorators/hooks/useMountEffect";
import { useWillMountEffect } from "../../decorators/hooks/useWillMountEffect";
import { historyStore } from "../../store/historyStore";

interface IDataInitializerProps {
  children: React.ReactNode;
}

const DataInitializer: FC<IDataInitializerProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useWillMountEffect(() => {
    historyStore.navigate = navigate;
    historyStore.location = location;
  });

  useEffect(() => {
    historyStore.location = location;
  }, [location]);

  // Убираем спиннер который отображается до загрузки системы
  useMountEffect(() => {
    const spinner = document.getElementById("spinner-wrapper");

    if (spinner) {
      spinner.style.display = "none";
    }
  });

  return <>{children}</>;
};

export { DataInitializer };
