import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/Injection";
import { LoginRegisterPresenter } from "../Authentication/LoginRegisterPresenter";

const LogoutComp = observer(({ presenter }) => {
  return <button onClick={presenter.logOut}>Logout</button>;
});

const Logout = withInjection({
  presenter: LoginRegisterPresenter,
})(LogoutComp);

export default Logout;
