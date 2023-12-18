import React from "react";
import { observer } from "mobx-react";
import { withInjection } from "../Core/Providers/Injection";
import { AuthorList } from "./AuthorList/AuthorList";
import { AddAuthor } from "./AddAuthor/AddAuthor";
import { AddBooks } from "../Books/AddBooks/AddBooks";
import { BookList } from "../Books/BookList/BookList";
import { AuthorsPresenter } from "./AuthorsPresenter";
import { MessagesComponent } from "../Core/Messages/MessagesComponent";
import { useValidation } from "../Core/Providers/useValidation";

const AuthorsComp = observer((props) => {
  const [, updateClientValidationMessages] = useValidation();
  const formValid = () => {
    const clientValidationMessages: string[] = [];
    if (props.presenter.newAuthorName === "")
      clientValidationMessages.push("No Author Name");
    updateClientValidationMessages(clientValidationMessages);
    return clientValidationMessages.length === 0;
  };

  React.useEffect(() => {
    async function load() {
      await props.presenter.load();
    }
    load();

    return () => {
      props.presenter.reset();
    };
  }, [props.presenter]);

  return (
    <>
      <h1>Authors</h1>
      <input
        value="show author list"
        type="button"
        onClick={props.presenter.toggleShowBooks}
      /><span>{props.presenter.authorsSummary}</span>
      <br />
      <AuthorList />
      <br />
      <AddAuthor formValid={formValid} />
      <br />
      <AddBooks presenter={props.presenter} />
      <br />
      <BookList />
      <br />
      <MessagesComponent />
    </>
  );
});

export const Authors = withInjection({
  presenter: AuthorsPresenter,
})(AuthorsComp);
