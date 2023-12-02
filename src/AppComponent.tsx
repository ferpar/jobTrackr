import * as React from "react";
import { observer } from "mobx-react";
import { withInjection } from "./Core/Providers/Injection";
import { AppPresenter } from "./AppPresenter";
import { NavigationComponent } from "./Navigation/NavigationComponent";
// import { HomeComponent } from './Home/HomeComponent'
// import { LoginRegisterComponent } from './Authentication/LoginRegisterComponent'
// import { MessagesRepository } from './Core/Messages/MessagesRepository'
import Home from "./Pages/Home.tsx";
import About from "./Pages/About.tsx";
import Contact from "./Pages/Contact.tsx";
import NotFound from "./Pages/NotFound.tsx";

export const AppComp = observer(({ presenter }) => {
  React.useEffect(() => {
    presenter.load(() => {});
  }, [presenter]);

  const renderedComponents = [
    {
      id: "homeLink",
      component: <Home key="homePage" />,
    },
    {
      id: "aboutLink",
      component: <About key="aboutPage" />,
    },
    {
      id: "contactLink",
      component: <Contact key="contactPage" />,
    },
    {
        id: "default",
        component: <NotFound key="notFound" />,
    }
  ];

  return (
    <div className="container">
      <div className="w3-row">
        <div className="w3-col s4 w3-center">
          <NavigationComponent />
        </div>
        <div className="w3-col s8 w3-left">
          {renderedComponents.map((current) => {
            return (
              presenter.currentRoute === current.id && current.component
            );
          })}
        </div>
      </div>
    </div>
  );
});

export const AppComponent = withInjection({
  presenter: AppPresenter,
  //   messagesRepository: MessagesRepository
})(AppComp);
