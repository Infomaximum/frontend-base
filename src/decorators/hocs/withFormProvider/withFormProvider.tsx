import type { TPropInjector } from "@infomaximum/utility";
import type { IFormProvider } from "@infomaximum/base/src/decorators/contexts/FormContext";
import { FormContext } from "@infomaximum/base/src/decorators/contexts/FormContext";
import hoistNonReactStatics from "hoist-non-react-statics";

export interface IWithFormProviderProps {
  formProvider: IFormProvider;
  formName: string;
}

export const withFormProvider: TPropInjector<IWithFormProviderProps> = (Component: any) => {
  const WithFormProviderComponent = (props: any) => (
    <FormContext.Consumer>
      {({ formProvider, formName }) => (
        <Component {...props} formProvider={formProvider} formName={formName} />
      )}
    </FormContext.Consumer>
  );

  return hoistNonReactStatics(WithFormProviderComponent, Component);
};
