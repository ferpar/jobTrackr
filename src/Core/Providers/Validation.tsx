import React from 'react'

const ValidationContext = React.createContext<{clientValidationMessages: Array<string>, updateClientValidationMessages: object}>({
  clientValidationMessages: [],
  updateClientValidationMessages: () => {}
})

export const ValidationProvider = (props) => {
  const [clientValidationMessages, updateClientValidationMessages] = React.useState([])

  return (
    <ValidationContext.Provider value={{ clientValidationMessages, updateClientValidationMessages }}>
      {props.children}
    </ValidationContext.Provider>
  )
}

export function useValidation(): [Array<string>, object] {
  const { clientValidationMessages, updateClientValidationMessages } = React.useContext(ValidationContext)
  return [clientValidationMessages, updateClientValidationMessages]
}
