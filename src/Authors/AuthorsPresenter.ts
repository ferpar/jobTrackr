import { injectable, inject } from "inversify";
import { makeObservable, observable, computed, action } from "mobx";
import { BooksRepository } from "../Books/BooksRepository";
import { AuthorsRepository } from "./AuthorsRepository";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";

@injectable()
export class AuthorsPresenter extends MessagesPresenter {
  @inject(AuthorsRepository)
  authorsRepository;

  @inject(BooksRepository)
  booksRepository;

  newAuthorName: string | null = null;

  showBooks: boolean = true;

  get viewModel() {
    return this.authorsRepository.authors;
  }

  get messagePm() {
    return this.authorsRepository.messagePm;
  }

  id: string;

  constructor() {
    super();
    this.id = Math.random().toString(36).substring(7);
    makeObservable(this, {
      newAuthorName: observable,
      showBooks: observable,
      toggleShowBooks: action,
      viewModel: computed,
      messagePm: computed,
      authorStrings: computed,
    });
    this.init();
    this.reset();
  }

  reset = () => {
    this.newAuthorName = "";
  };

  load = async () => {
    await this.authorsRepository.load();
  };

  toggleShowBooks = () => {
    this.showBooks = !this.showBooks;
  };

  get authorStrings() {
    const authorStrings = this.authorsRepository.authors.map((author) => {
        if (author?.books?.length > 0) {
            return `${author.name}  (${author.books.map( book => book.name).join('; ')})`;
        } else {
            return `${author.name} has written no books`;
        }
    });

    return authorStrings;
  }

  // addAuthor = async () => {}
}
