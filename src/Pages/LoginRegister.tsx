import React from "react";
import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/withInjection";
import { AuthenticationPresenter } from "../Authentication/AuthenticationPresenter";
import { MessagesComponent } from "../Core/Messages/MessagesComponent";
import { useValidation } from "../Core/Providers/useValidation";

const LoginRegisterComp = observer(({ presenter }: { presenter: AuthenticationPresenter }): React.ReactNode => {
  const [, updateClientValidationMessages] = useValidation();
  const formValid = () => {
    const clientValidationMessages: Array<string> = [];
    if (presenter.email === "") {
      clientValidationMessages.push("Email is required");
    }
    if (presenter.password === "") {
      clientValidationMessages.push("Password is required");
    }
    updateClientValidationMessages(clientValidationMessages);
    return clientValidationMessages.length === 0;
  }
  const switchOption = () => {
    presenter.option = presenter.option === "register" ? "login" : "register";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid()) {
      return;
    }
    presenter.option === "register" ? presenter.register() :
    presenter.login();
  };

  // initially clearing the form, setting option to login
  React.useEffect(() => {
    presenter.reset();
  }, [presenter]);

  return (
    <div className="login-register">
      <h2>{presenter.title}</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="form-group">
            <label htmlFor="email-input">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email-input"
              placeholder="Enter email"
              value={presenter.email}
              onChange={(e) => (presenter.email = e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password-input">Password</label>
            <input
              type="password"
              className="form-control"
              id="password-input"
              placeholder="Password"
              value={presenter.password}
              onChange={(e) => (presenter.password = e.target.value)}
            />
          </div>
        </fieldset>
        <MessagesComponent />
        <button type="submit" className="btn btn-primary">
          {presenter.submitButtonTitle}
        </button>
      </form>

      <a onClick={switchOption} style={{ cursor: "pointer" }}>
        {presenter.switchButtonTitle}
      </a>
    </div>
  );
});

const LoginRegister = withInjection({
  presenter: AuthenticationPresenter,
})(LoginRegisterComp);

export default LoginRegister;
