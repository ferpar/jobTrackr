import React from "react";

export type ValidationContextType = {
  clientValidationMessages: Array<string>;
  updateClientValidationMessages: (message) => void;
};


const ValidationContext = React.createContext<ValidationContextType>({
  clientValidationMessages: [],
  updateClientValidationMessages: () => {},
});

export const ValidationProvider = (props) => {
  const [clientValidationMessages, updateClientValidationMessages] =
    React.useState([]);

  return (
    <ValidationContext.Provider
      value={{ clientValidationMessages, updateClientValidationMessages }}
    >
      {props.children}
    </ValidationContext.Provider>
  );
};

export function useValidation(): [Array<string>, (messages) => void] {
  const { clientValidationMessages, updateClientValidationMessages } =
    React.useContext(ValidationContext);
  return [clientValidationMessages, updateClientValidationMessages];
}
