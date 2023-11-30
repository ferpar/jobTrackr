import React, { useContext } from 'react'
import { Container, interfaces } from 'inversify'

const InversifyContext = React.createContext<{container: Container | null}>({ container: null })

export const InjectionProvider = (props) => {
  return <InversifyContext.Provider value={{ container: props.container }}>{props.children}</InversifyContext.Provider>
}

export function useInjection(identifier) {
  const { container } = useContext(InversifyContext)
  if (!container) {
    throw new Error()
  }
  return container.get(identifier)
}

export function withInjection(identifiers: { [key: string]: interfaces.ServiceIdentifier }) {
  return (Component) => {
    return React.memo((props) => {
      const { container } = useContext(InversifyContext)
      if (!container) {
        throw new Error()
      }

      const finalProps = { ...props }
      for (const [key, value] of Object.entries(identifiers)) {
        finalProps[key] = container.get(value)
      }

      return <Component {...finalProps} />
    })
  }
}
