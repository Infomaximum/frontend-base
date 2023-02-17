/* eslint-disable no-console */
import { useEffect, useMemo } from "react";
import { assertSilent } from "@im/asserts";
import { useFirstMountState } from "./useFirstMountState";
import { useMountEffect } from "./useMountEffect";

type TLogLevel = "warn" | "log" | "error";

type TLoggerParams = {
  componentName: string;
  logLevel?: TLogLevel;

  [param: string]: any;
};

/**
 * хук для логирования жизненного цикла компонента
 */
export const useLogger = ({ componentName, logLevel = "warn", ...rest }: TLoggerParams) => {
  const isFirstMount = useFirstMountState();

  const logger = useMemo(() => {
    switch (logLevel) {
      case "warn":
        return console.warn;
      case "error":
        return console.error;
      case "log":
        return console.log;
      default:
        assertSilent(false, "не обработанный тип логирования");
        return console.log;
    }
  }, [logLevel]);

  useMountEffect(() => {
    logger(`${componentName} mounted `, rest);

    return () => {
      logger(`${componentName} unmounted `, rest);
    };
  });

  useEffect(() => {
    if (!isFirstMount) {
      logger(`${componentName} updated `, rest);
    }
  });
};
