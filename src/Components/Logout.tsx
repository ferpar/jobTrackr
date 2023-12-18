import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/withInjection";
import { LoginRegisterPresenter } from "../Authentication/LoginRegisterPresenter";

const LogoutComp = observer(({ presenter }) => {
  return <button onClick={presenter.logOut}>Logout</button>;
});

const Logout = withInjection({
  presenter: LoginRegisterPresenter,
})(LogoutComp);

export default Logout;
