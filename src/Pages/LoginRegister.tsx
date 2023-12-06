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
    presenter.submit();
  };

  // initially clearing the form, setting option to login
  React.useEffect(() => {
    presenter.reset();
  }, []);

  return (
    <div>
      <h2>{presenter.title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={presenter.email}
            onChange={(e) => (presenter.email = e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={presenter.password}
            onChange={(e) => (presenter.password = e.target.value)}
          />
        </div>
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
