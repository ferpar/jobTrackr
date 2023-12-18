import { observer } from "mobx-react";
import { withInjection } from "../../Core/Providers/withInjection";
import { AuthorsPresenter } from "../AuthorsPresenter";

const AuthorsComp = observer(({ presenter }) => {
  return (
    <div>
      {presenter.shouldShowAuthors && (<ul>
        {presenter.authorStrings.map((authorString, idx) => (
          <li key={idx}>{authorString}</li>
        ))}
      </ul>)}
    </div>
  );
});

export const AuthorList = withInjection({
  presenter: AuthorsPresenter,
})(AuthorsComp);