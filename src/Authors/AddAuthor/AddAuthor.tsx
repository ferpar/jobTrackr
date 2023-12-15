import { observer } from "mobx-react";
import { useValidation } from "../../Core/Providers/Validation";
import { withInjection } from "../../Core/Providers/Injection";
import { AuthorsPresenter } from "../AuthorsPresenter";

const AddAuthorComp = observer(
  ({
    presenter,
    formValid,
  }: {
    presenter: { newAuthorName: string; addAuthor: () => void };
    formValid?: () => boolean;
  }) => {
    const [, updateClientValidationMessages] = useValidation();

    const defaultFormValid = () => {
      const clientValidationMessages: string[] = [];
      if (presenter.newAuthorName === "")
        clientValidationMessages.push("No Author Name");
      updateClientValidationMessages(clientValidationMessages);
      return clientValidationMessages.length === 0;
    };

    const validateForm = formValid || defaultFormValid;

    const handleSubmit = (event) => {
      event.preventDefault();
      if (validateForm()) {
        presenter.addAuthor();
      }
    };

    const onChange = (event) => {
      presenter.newAuthorName = event.target.value;
    };

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              value={presenter.newAuthorName}
              placeholder="Enter author name"
              onChange={onChange}
            />
            <button type="submit">Add Author</button>
          </label>
        </form>
      </div>
    );
  }
);

export const AddAuthor = withInjection({
  presenter: AuthorsPresenter,
})(AddAuthorComp);
