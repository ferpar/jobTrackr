import { useContext } from 'react'
import { InversifyContext } from './Injection'
import { interfaces } from 'inversify'

export function useInjection<T>(identifier: interfaces.ServiceIdentifier<T>) {
  const { container } = useContext(InversifyContext)
  if (!container) {
    throw new Error()
  }
  return container.get(identifier)
}