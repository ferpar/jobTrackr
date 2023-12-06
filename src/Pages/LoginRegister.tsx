import React from "react";
import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/Injection";
import { LoginRegisterPresenter } from "../Authentication/LoginRegisterPresenter";

const LoginRegisterComp = observer(({ presenter }): React.ReactElement => {
  const switchOption = () => {
    presenter.option = presenter.option === "register" ? "login" : "register";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    presenter.option === "register" ? presenter.register() : presenter.login();
  };

  // initially clearing the form, setting option to login
  React.useEffect(() => {
    presenter.reset();
  }, []);

  return (
    <div>
      <h2>{presenter.title}</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="form-group">
            <label htmlFor="email-input">Email address</label>
            <input
              required={true}
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
              required={true}
              type="password"
              className="form-control"
              id="password-input"
              placeholder="Password"
              value={presenter.password}
              onChange={(e) => (presenter.password = e.target.value)}
            />
          </div>
        </fieldset>
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
  presenter: LoginRegisterPresenter,
})(LoginRegisterComp);

export default LoginRegister;
