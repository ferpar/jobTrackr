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

  isLoading = false;

  messagePm = "UNSET";

  authors: Author[] = [];
  id: string;

  constructor() {
    this.id = Math.random().toString(36).substring(7);
    makeObservable(this, {
      messagePm: observable,
      authors: observable,
      load: action,
    });
  }

  load = async () => {
    // do not load if already loading // prevent spamming the server
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    this.messagePm = "LOADING";
    const authorResponse = await this.dataGateway.get(
      "/authors?emailOwnerId=" + this.userModel.email
    );
    this.authors = authorResponse.result;
    const bookIds = authorResponse.result
      .map((author) => author.bookIds)
      .flat();
    const bookPromises = bookIds.map(async (bookId) =>
      this.booksRepository.dataGateway.get(
        "/book?emailOwnerId=" + this.userModel.email + "&bookId=" + bookId
      )
    );
    const bookResponses = await Promise.all(bookPromises);
    const authorsWithBooks = this.authors.map((author: Author) => {
      const bookArrs = bookResponses.map((bookResponse) => bookResponse.result);

      const books = bookArrs
        .flat()
        .filter((book) => author.bookIds.includes(book.bookId));
      return { ...author, books };
    });
    this.authors = authorsWithBooks;
    this.messagePm = "LOADED";
    this.isLoading = false;
    return authorsWithBooks;
  };

  reset = () => {
    this.messagePm = "RESET";
  };

  addAuthor = async (authorName: string, bookNames: string[]) => {
    this.messagePm = "ADDING";
    // const bookPromises = bookNames.map(async (bookName) => {
    //   return await this.booksRepository.addBook(bookName);
    // });
    // console.log("bookPromises", bookPromises)
    // const bookResponses = await Promise.all(bookPromises);
    const bookResponses: { success: string; result: { bookId: number } }[] = [];
    for (const bookName of bookNames) {
      const bookResponse = await this.booksRepository.addBook(bookName);
      bookResponses.push(bookResponse);
    }

    const bookIds = bookResponses.map(
      (bookResponse) => bookResponse.result.bookId
    );
    const addedAuthorPm = await this.dataGateway.post("/authors", {
      name: authorName,
      bookIds,
      emailOwnerId: this.userModel.email,
    });
    await this.load();
    this.messagePm = "ADDED";
    return addedAuthorPm;
  };
}
