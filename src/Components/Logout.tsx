import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/withInjection";
import { AuthenticationPresenter } from "../Authentication/AuthenticationPresenter";

const LogoutComp = observer(
  ({ presenter }: { presenter: AuthenticationPresenter }) => {
    return (
      <button className="logout-btn" onClick={presenter.logOut}>
        Logout
      </button>
    );
  }
);

const Logout = withInjection({
  presenter: AuthenticationPresenter,
})(LogoutComp);

export default Logout;
