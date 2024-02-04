import React, { useContext } from "react";
import { interfaces } from "inversify";
import { InversifyContext } from "./Injection";

export function withInjection(
  identifiers: Record<string, interfaces.ServiceIdentifier>
) {
  return <TProps,>(Component: (props: TProps) => React.ReactNode) => {
    return React.memo((props: TProps) => {
      const { container } = useContext(InversifyContext);
      if (!container) {
        throw new Error();
      }

      const addedProps = Object.keys(identifiers).reduce((acc, key: string) => {
        acc[key] = container.get(identifiers[key]);
        return acc;
      }, {} as Record<string, unknown>);

      return <Component {...props} {...addedProps} />;
    });
  };
}
