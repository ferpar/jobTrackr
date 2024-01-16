import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/withInjection";
import { LoginRegisterPresenter } from "../Authentication/AuthenticationPresenter";

const LogoutComp = observer(({ presenter }) => {
  return <button className="logout-btn" onClick={presenter.logOut}>Logout</button>;
});

const Logout = withInjection({
  presenter: LoginRegisterPresenter,
})(LogoutComp);

export default Logout;
