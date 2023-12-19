import { injectable, inject } from "inversify";
import { makeObservable, observable, computed, action } from "mobx";
import { BooksRepository } from "../Books/BooksRepository";
import { AuthorsRepository } from "./AuthorsRepository";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";

const maxAuthors = 5;
@injectable()
export class AuthorsPresenter extends MessagesPresenter {
  @inject(AuthorsRepository)
  authorsRepository;

  @inject(BooksRepository)
  booksRepository;

  newAuthorName: string | null = null;

  showAuthors: boolean | null = null;

  get viewModel() {
    return this.authorsRepository.authors;
  }

  get messagePm() {
    return this.authorsRepository.messagePm;
  }

  id: string;

  newBookTitle: string | null = null;

  showToggle: boolean | null = null;

  constructor() {
    super();
    this.id = Math.random().toString(36).substring(7);
    makeObservable(this, {
      newAuthorName: observable,
      showAuthors: observable,
      newBookTitle: observable,
      toggleShowBooks: action,
      viewModel: computed,
      messagePm: computed,
      authorStrings: computed,
      addBook: action,
      clearInputs: action,
      shouldShowAuthors: computed,
    });
    this.init();
    this.newAuthorName = "";
    this.newBookTitle = "";
    this.showToggle = false;
  }

  reset = () => {
    this.newAuthorName = "";
    this.newBookTitle = "";
    this.showToggle = false;
    this.booksRepository.bufferMode = false;
  };

  load = async () => {
    const authors = await this.authorsRepository.load();
    if (authors?.length > 0) {
      this.showToggle = true;
    }
    this.booksRepository.bufferMode = true;
  };

  toggleShowBooks = () => {
    this.showAuthors = !this.showAuthors;
  };

  get shouldShowAuthors() {
    if (this.showAuthors === null && this.authorsRepository.authors.length >= maxAuthors) {
      return false
    }
    if (this.showAuthors === null && this.authorsRepository.authors.length < maxAuthors) {
      return true
    }

    return this.showAuthors
  }

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

  addBook = () => {
    if (!this.newBookTitle) return
    this.booksRepository.addBookToBuffer(this.newBookTitle);
  }

  clearInputs = () => {
    this.booksRepository.clearBooksBuffer();
    this.newAuthorName = "";
    this.newBookTitle = "";
  }


  addAuthor = async () => {
    if (!this.newAuthorName) return
    // reset showAuthors so that the list is hidden after adding an author
    this.showAuthors = null;
    const bookNames = this.booksRepository.bookBuffer.map(book => book.name)
    const addAuthorPm = await this.authorsRepository.addAuthor(this.newAuthorName, bookNames);
    this.unpackRepositoryPmToVm(addAuthorPm, "Author added");
    this.clearInputs()
  }

  get authorsSummary() {
    if (this.authorsRepository.authors.length === 0) {
      return " (No authors)";
    } else if (this.authorsRepository.authors.length === 1) {
      return " (1 author)";
    } else {
      return ` (${this.authorsRepository.authors.length} authors)`;
    }
  }
}
