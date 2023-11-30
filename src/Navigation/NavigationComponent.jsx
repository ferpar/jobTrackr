import React from "react";
import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/Injection";
import { Router } from "../Routing/Router";

const NavigationComp = observer(({ router }) => {
  return (
    <div>
      <button onClick={() => router.goToId("homeLink")}>Home</button>
      <button onClick={() => router.goToId("aboutLink")}>About</button>
      <button onClick={() => router.goToId("contactLink")}>Contact</button>
    </div>
  );
});

export const NavigationComponent = withInjection({
  router: Router,
})(NavigationComp);
