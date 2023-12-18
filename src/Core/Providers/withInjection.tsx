import React, { useContext } from "react";
import {interfaces} from "inversify";
import { InversifyContext } from "./Injection";

export function withInjection(identifiers: {
  [key: string]: interfaces.ServiceIdentifier;
}) {
  return (Component) => {
    return React.memo((props) => {
      const { container } = useContext(InversifyContext);
      if (!container) {
        throw new Error();
      }

      const finalProps = { ...props };
      for (const [key, value] of Object.entries(identifiers)) {
        finalProps[key] = container.get(value);
      }

      return <Component {...finalProps} />;
    });
  };
}
