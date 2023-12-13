import { injectable, inject } from "inversify";
import { Config } from "../Core/Config";
import { action, makeObservable, observable } from "mobx";
import { Types } from "../Core/Types";
import { UserModel } from "../Authentication/UserModel";
import { BooksRepository } from "../Books/BooksRepository";

interface Author {
    name: string;
    emailOwnerId: string;
    bookIds: number[];
    books: Book[];
}

interface Book {
    bookId: number;
    name: string;
    emailOwnerId: string;
}
@injectable()
export class AuthorsRepository {
  baseUrl: string | null = null;

  @inject(Types.IDataGateway)
  dataGateway;

  @inject(UserModel)
  userModel;

  @inject(Config)
  config;

  @inject(BooksRepository)
  booksRepository;

  messagePm = "UNSET";

  authors: Author[] = [];

  constructor() {
    makeObservable(this, {
      messagePm: observable,
      authors: observable,
      load: action,
    });
  }

  load = async () => {
    this.messagePm = "LOADING";
    const authorResponse = await this.dataGateway.get(
      "/authors?emailOwnerId=" + this.userModel.email
    );
    this.authors = authorResponse.result;
    const bookIds = authorResponse.result.map((author) => author.bookIds).flat();
    const bookPromises = bookIds.map(async (bookId) =>
      this.booksRepository.dataGateway.get(
        "/books?emailOwnerId=" + this.userModel.email + "&bookId=" + bookId
      )
    );
    const bookResponses = await Promise.all(bookPromises);
    const authorsWithBooks = this.authors.map((author: Author) => {
        const books = bookResponses
            .map((bookResponse) => bookResponse.result)
            .flat()
            .filter((book) => author.bookIds.includes(book.bookId));
        return { ...author, books };
        })
    this.authors = authorsWithBooks;
    this.messagePm = "LOADED";
  };

  reset = () => {
    this.messagePm = "RESET";
  };

  // addAuthor = async (title: string) => {
  //     this.messagePm = 'ADDING'
  //     const addAuthorPm = await this.dataGateway.post('/authors', {
  //         name: title,
  //         emailOwnerId: this.userModel.email,
  //     })
  //     await this.load()
  //     this.messagePm = 'ADDED'
  //     return addAuthorPm
  // }
}
