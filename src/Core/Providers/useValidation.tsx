import React from "react"
import { ValidationContext } from "./Validation";

export function useValidation(): [Array<string>, (messages) => void] {
  const { clientValidationMessages, updateClientValidationMessages } =
    React.useContext(ValidationContext);
  return [clientValidationMessages, updateClientValidationMessages];
}