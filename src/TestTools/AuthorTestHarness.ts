import "reflect-metadata";
import { vi } from "vitest";
import { GetSuccessfulBookAddedStub } from "../TestTools/GetSuccessfulBookAddedStub";
import { SingleAuthorsResultStub } from "../TestTools/SingleAuthorResultStub";
import { SingleBookResultStub } from "./SingleBookResultStub";
import { AppTestHarness } from "../TestTools/AppTestHarness";
import { AuthorsPresenter } from "../Authors/AuthorsPresenter";
import { BookListPresenter } from "../Books/BookList/BookListPresenter";
import { BooksRepository } from "../Books/BooksRepository";
import IDataGateway from "../Core/IDataGateway";

export class AuthorTestHarness {
  testHarness: AppTestHarness | null = null;
  authorsGateway: IDataGateway | null = null;
  booksGateway: IDataGateway | null = null;
  authorsPresenter: AuthorsPresenter | null = null;
  bookListPresenter: BookListPresenter | null = null;
  booksRepository: BooksRepository | null = null;
  dynamicBookNamesStack: string[] | null = null;
  dynamicBookIdStack: number[] | null = null;

  constructor(
    testHarness: AppTestHarness | null,
  ) {
    this.testHarness = testHarness;
    if (!this.testHarness) throw new Error("testHarness not found");
    if (!this.testHarness.container) throw new Error("container not found");
    if (!this.testHarness.userModel.token)
      throw new Error(
        "token not found, please login before instantiating AuthorTestHarness"
      );
    this.dynamicBookNamesStack = ["new book", "bookA", "bookB", "bookC"];
    this.dynamicBookIdStack = [5, 4, 3, 2, 1];
  }

  addAuthorWithBook = async ( ) => {
    if (!this.testHarness) throw new Error("testHarness not found");
    this.authorsPresenter = this.testHarness.container.get(AuthorsPresenter);
    this.bookListPresenter = this.testHarness.container.get(BookListPresenter);
    this.booksRepository = this.testHarness.container.get(BooksRepository);
    this.booksGateway = this.booksRepository?.dataGateway;
    this.authorsGateway = this.authorsPresenter?.authorsRepository?.dataGateway;

    // safety check
    if (!this.authorsGateway || !this.booksGateway)
      throw new Error("gateway not found");
    // set stub to return new author
    this.authorsGateway.get = vi.fn().mockImplementation(() => {
      const newStub = SingleAuthorsResultStub();
      newStub.result.push({
        authorId: 3,
        name: "new author",
        bookIds: [4],
        latLon: "19,22",
      });
      return Promise.resolve(newStub);
    });

    // set stub to return new book
    this.booksGateway.get = vi.fn().mockImplementation(() => {
      return Promise.resolve(
        SingleBookResultStub(
          this.dynamicBookNamesStack?.pop(),
          this.dynamicBookIdStack?.pop()
        )
      );
    });

    // set stub to return new book
    this.booksGateway.post = vi.fn().mockImplementation(() => {
      return Promise.resolve(GetSuccessfulBookAddedStub(4));
    });
    if (!this.authorsPresenter) throw new Error("authorsPresenter not found");

    // set up new author and book
    this.authorsPresenter.newAuthorName = "new author";
    this.authorsPresenter.newBookTitle = "new book";
    this.authorsPresenter.addBook();

    // reset dynamic stacks
    const addedBooks: string[] = this.booksRepository?.bookBuffer.map(
      (book) => book.name
    ) as string[];
    const newBookNamesStack = [...addedBooks, "bookA", "bookB", "bookC"];
    const newBookIdStack = [5, 4, 3, 2, 1];
    this.dynamicBookNamesStack = newBookNamesStack;
    this.dynamicBookIdStack = newBookIdStack;

    await this.authorsPresenter?.addAuthor();
  };

  addAuthorWithTwoBooks = async ( ) => {

    if (!this.testHarness) throw new Error("testHarness not found");
    this.authorsPresenter = this.testHarness.container.get(AuthorsPresenter);
    this.bookListPresenter = this.testHarness.container.get(BookListPresenter);
    this.booksRepository = this.testHarness.container.get(BooksRepository);
    this.booksGateway = this.booksRepository?.dataGateway;
    this.authorsGateway = this.authorsPresenter?.authorsRepository?.dataGateway;

    // safety check
    if (!this.authorsGateway || !this.booksGateway)
      throw new Error("gateway not found");
    // set stub to return new author
    this.authorsGateway.get = vi.fn().mockImplementation(() => {
      const newStub = SingleAuthorsResultStub();
      newStub.result.push({
        authorId: 3,
        name: "new author",
        bookIds: [4, 5],
        latLon: "19,22",
      });
      return Promise.resolve(newStub);
    });

    // set stub to return new book
    this.booksGateway.get = vi.fn().mockImplementation(() => {
      return Promise.resolve(
        SingleBookResultStub(
          this.dynamicBookNamesStack?.pop(),
          this.dynamicBookIdStack?.pop()
        )
      );
    });

    // set stub to return new book
    this.booksGateway.post = vi.fn().mockImplementation(() => {
      return Promise.resolve(GetSuccessfulBookAddedStub(4));
    });
    if (!this.authorsPresenter) throw new Error("authorsPresenter not found");

    // set up new author and book
    this.authorsPresenter.newAuthorName = "new author";
    this.authorsPresenter.newBookTitle = "first book";
    this.authorsPresenter.addBook();
    this.authorsPresenter.newBookTitle = "second book";
    this.authorsPresenter.addBook();

    // reset dynamic stacks
    const addedBooks: string[] = this.booksRepository?.bookBuffer.map(
      (book) => book.name
    ) as string[];
    const newBookNamesStack = [...addedBooks, "bookA", "bookB", "bookC"];
    const newBookIdStack = [5, 4, 3, 2, 1];
    this.dynamicBookNamesStack = newBookNamesStack;
    this.dynamicBookIdStack = newBookIdStack;

    await this.authorsPresenter?.addAuthor();
  }
}
