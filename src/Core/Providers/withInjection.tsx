import React, { useContext } from "react";
import { interfaces } from "inversify";
import { InversifyContext } from "./Injection";

type Identifiers = Record<string, interfaces.ServiceIdentifier>;

export function withInjection(
  identifiers: Identifiers 
) {
  return <TProps,>(Component: React.ComponentType<TProps>) => {
    return React.memo((props: Omit<TProps, keyof Partial<Identifiers>>) => {
      const { container } = useContext(InversifyContext);
      if (!container) {
        throw new Error();
      }

      const addedProps = Object.keys(identifiers).reduce((acc, key: string) => {
        acc[key] = container.get(identifiers[key]);
        return acc;
      }, {} as Record<string, unknown>);


      return <Component {...props as TProps} {...addedProps} />;
    });
  };
}
