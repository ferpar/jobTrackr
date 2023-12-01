import React from "react";
import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/Injection";
import { Router } from "../Routing/Router";

const NavigationComp = observer(({ router }) => {
  return (
    <div>
      <button onClick={() => router.goToPath("/")}>Home</button>
      <button onClick={() => router.goToPath("/about")}>About</button>
      <button onClick={() => router.goToPath("/contact")}>Contact</button>
    </div>
  );
});

export const NavigationComponent = withInjection({
  router: Router,
})(NavigationComp);
