import * as React from "react";
import { observer } from "mobx-react";
import { withInjection } from "./Core/Providers/Injection.tsx";
import { AppPresenter } from "./AppPresenter.ts";
import { NavigationComponent } from "./Navigation/NavigationComponent.jsx";
import LoginRegister from "./Pages/LoginRegister.tsx";
import Home from "./Pages/Home.tsx";
import About from "./Pages/About.tsx";
import Contact from "./Pages/Contact.tsx";
import NotFound from "./Pages/NotFound.tsx";
import Logout from "./Components/Logout.tsx";
import { useValidation } from "./Core/Providers/Validation.tsx";
import { Books } from "./Books/Books.tsx";
import { Authors } from "./Authors/Authors.tsx";

export const AppComp = observer(({ presenter }) => {
  const [, updateClientValidationMessages] = useValidation();

  const onRouteChange = () => {
    updateClientValidationMessages([]);
  };

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
      id: "booksLink",
      component: <Books key="booksPage" />,
    },
    {
      id: "authorsLink",
      component: <Authors key="authorsPage" />,
    },
    {
      id: "default",
      component: <NotFound key="notFound" />,
    },
  ];

  React.useEffect(() => {
    presenter.load(onRouteChange);
  }, [presenter]);

  return (
    <div className="container">
      {presenter.currentRoute === "loginLink" ? (
        <LoginRegister />
      ) : (
        <div className="w3-row">
          <div className="w3-col s4 w3-center">
            <NavigationComponent />
          </div>
          <div className="w3-col s8 w3-left">
            {renderedComponents.map((current) => {
              return presenter.currentRoute === current.id && current.component;
            })}
          </div>
          <Logout />
        </div>
      )}
    </div>
  );
});

export const App = withInjection({
  presenter: AppPresenter,
  //   messagesRepository: MessagesRepository
})(AppComp);