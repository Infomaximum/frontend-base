import type { TPropInjector } from "@im/utils";
import type { IFormProvider } from "src/decorators/contexts/FormContext";
import FormContext from "src/decorators/contexts/FormContext";
import hoistNonReactStatics from "hoist-non-react-statics";

export interface IWithFormProviderProps {
  formProvider: IFormProvider;
  formName: string;
}

const withFormProvider: TPropInjector<IWithFormProviderProps> = (
  Component: any
) => {
  const WithFormProviderComponent = (props: any) => (
    <FormContext.Consumer>
      {({ formProvider, formName }) => (
        <Component {...props} formProvider={formProvider} formName={formName} />
      )}
    </FormContext.Consumer>
  );

  return hoistNonReactStatics(WithFormProviderComponent, Component);
};

export default withFormProvider;
