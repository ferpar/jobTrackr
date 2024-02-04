import React from "react";

export type ValidationContextType = {
  clientValidationMessages: Array<string>;
  updateClientValidationMessages: React.Dispatch<React.SetStateAction<Array<string>>>;
};

export const ValidationContext = React.createContext<ValidationContextType>({
  clientValidationMessages: [],
  updateClientValidationMessages: () => {},
});

export const ValidationProvider = (props: { children: React.ReactNode}) => {
  const [clientValidationMessages, updateClientValidationMessages] =
    React.useState<string[]>([]);
    

  return (
    <ValidationContext.Provider
      value={{ clientValidationMessages, updateClientValidationMessages }}
    >
      {props.children}
    </ValidationContext.Provider>
  );
};

