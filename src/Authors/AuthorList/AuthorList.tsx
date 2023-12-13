import { observer } from "mobx-react";
import { withInjection } from "../../Core/Providers/Injection";
import { AuthorsPresenter } from "../AuthorsPresenter";

const AuthorsComp = observer(({ presenter }) => {
  return (
    <div>
      {presenter.showBooks && (<ul>
        {presenter.viewModel.map((author) => (
          <li key={author.id}>{author.name}</li>
        ))}
      </ul>)}
    </div>
  );
});

export const AuthorList = withInjection({
  presenter: AuthorsPresenter,
})(AuthorsComp);