import { useContext } from 'react'
import { InversifyContext } from './Injection'

export function useInjection(identifier) {
  const { container } = useContext(InversifyContext)
  if (!container) {
    throw new Error()
  }
  return container.get(identifier)
}