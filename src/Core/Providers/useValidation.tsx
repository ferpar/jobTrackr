import React from "react"
import { ValidationContext } from "./Validation";

export function useValidation(): [Array<string>, React.Dispatch<React.SetStateAction<Array<string>>>] {
  const { clientValidationMessages, updateClientValidationMessages } =
    React.useContext(ValidationContext);
  return [clientValidationMessages, updateClientValidationMessages];
}