import { observer } from "mobx-react";
import { useValidation } from "../../Core/Providers/useValidation";

export const AddBooks = observer(
  ({
    presenter,
    formValid,
  }: {
    presenter: {
      newBookTitle: string;
      addBook: () => void;
      clearBooksToAdd: () => void;
    };
    formValid?: () => boolean;
  }) => {
    const [, updateClientValidationMessages] = useValidation();

    const defaultFormValid = () => {
      const clientValidationMessages: string[] = [];
      if (presenter.newBookTitle === "") {
        clientValidationMessages.push("No book name");
      }
      updateClientValidationMessages(clientValidationMessages);
      return clientValidationMessages.length === 0;
    };

    const validateForm = formValid || defaultFormValid;

    const handleSubmit = (event) => {
      event.preventDefault();
      if (validateForm()) {
        presenter.addBook();
      }
    };

    const onChange = (event) => {
      presenter.newBookTitle = event.target.value;
    };

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              value={presenter.newBookTitle}
              placeholder="Enter book name"
              onChange={onChange}
            />
            <button type="submit">Add Book</button>
          </label>
        </form>
        {presenter.clearBooksToAdd && (
          <button onClick={presenter.clearBooksToAdd}>Clear</button>
        )}
      </div>
    );
  }
);
