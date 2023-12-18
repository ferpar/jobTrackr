import React from 'react'
import { Container } from 'inversify'

export const InversifyContext = React.createContext<{container: Container | null}>({ container: null })

export const InjectionProvider = (props) => {
  return <InversifyContext.Provider value={{ container: props.container }}>{props.children}</InversifyContext.Provider>
}

