import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { ValidationProvider } from "./Core/Providers/Validation.tsx";
import "./reset.css";
import "./index.css";
import { InjectionProvider } from "./Core/Providers/Injection.tsx";
import { container } from "./AppIOC.ts";
import { configure } from "mobx";

configure({
  enforceActions: "never",
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: false,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <InjectionProvider container={container}>
      <ValidationProvider>
        <App />
      </ValidationProvider>
    </InjectionProvider>
  </React.StrictMode>
);
