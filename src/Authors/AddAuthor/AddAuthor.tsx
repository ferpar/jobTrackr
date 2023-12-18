import { observer } from "mobx-react";
import { useValidation } from "../../Core/Providers/useValidation";
import { useInjection } from "../../Core/Providers/useInjection";
import { AuthorsPresenter } from "../AuthorsPresenter";

export const AddAuthor = observer(
  ({ formValid }: { formValid?: () => boolean }) => {
    const presenter: AuthorsPresenter = useInjection(
      AuthorsPresenter
    ) as AuthorsPresenter;
    const [, updateClientValidationMessages] = useValidation();

    const defaultFormValid = () => {
      const clientValidationMessages: string[] = [];
      if (presenter.newAuthorName === "")
        clientValidationMessages.push("Please enter a Name");
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
              value={presenter.newAuthorName || ""}
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
