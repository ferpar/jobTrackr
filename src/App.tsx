import React from "react";
import { observer } from "mobx-react";
import { withInjection } from "./Core/Providers/withInjection.tsx";
import { AppPresenter } from "./AppPresenter.ts";
import { Navigation } from "./Navigation/Navigation";
import LoginRegister from "./Pages/LoginRegister.tsx";
import Home from "./Pages/Home.tsx";
import About from "./Pages/About.tsx";
import Contact from "./Pages/Contact.tsx";
import NotFound from "./Pages/NotFound.tsx";
import Applications from "./Applications/Applications.tsx";
import Logout from "./Components/Logout.tsx";
import { useValidation } from "./Core/Providers/useValidation.tsx";

export const AppComp = observer(({ presenter }: ({presenter: AppPresenter}) ) => {
  const [, updateClientValidationMessages] = useValidation();

  const onRouteChange = React.useCallback(async () => {
    updateClientValidationMessages([]);
  }, [updateClientValidationMessages]);

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
      id: "applications",
      component: <Applications key="applicationsPage" />
    },
    {
      id: "default",
      component: <NotFound key="notFound" />,
    },
  ];

  React.useEffect(() => {
    presenter.load(onRouteChange);
  }, [presenter, onRouteChange]);

  return (
    <div className="container">
      {presenter.currentRoute === "loginLink" ? (
        <LoginRegister />
      ) : (
        <div className="app-wrapper">
          <div className="top-actions">
            <Logout />
          </div>
          <div className="main-content">
            <div className="nav-column">
              <Navigation />
            </div>
            <div className="page-content">
              {renderedComponents.map((current) => {
                return (
                  presenter.currentRoute === current.id && current.component
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const App = withInjection({
  presenter: AppPresenter,
})(AppComp);
