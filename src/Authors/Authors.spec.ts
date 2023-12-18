import "reflect-metadata";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub";
import { GetSuccessfulBookAddedStub } from "../TestTools/GetSuccessfulBookAddedStub";
import { GetSuccessfulAuthorAddedStub } from "../TestTools/GetSuccessfulAuthorAddedStub";
import { SingleBookResultStub } from "../TestTools/SingleBookResultStub";
import { SingleAuthorsResultStub } from "../TestTools/SingleAuthorResultStub";
import { AppTestHarness } from "../TestTools/AppTestHarness";
import { AuthorsPresenter } from "./AuthorsPresenter";
import { BookListPresenter } from "../Books/BookList/BookListPresenter";
import { BooksRepository } from "../Books/BooksRepository";
import IDataGateway from "../Core/IDataGateway";
import { NoAuthorsResultStub } from "../TestTools/NoAuthorsResultStub";
import { AuthorTestHarness } from "../TestTools/AuthorTestHarness";

let testHarness: AppTestHarness | null = null;
let authorsGateway: IDataGateway | null = null;
let booksGateway: IDataGateway | null = null;
let authorsPresenter: AuthorsPresenter | null = null;
let bookListPresenter: BookListPresenter | null = null;
let booksRepository: BooksRepository | null = null;
let dynamicBookNamesStack: string[] | null = null;
let dynamicBookIdStack: number[] | null = null;

describe("authors", () => {
  beforeEach(async () => {
    testHarness = new AppTestHarness();
    testHarness.init();
    testHarness.bootstrap();
    await testHarness.setupLogin(GetSuccessfulUserLoginStub);
    authorsPresenter = testHarness.container.get(AuthorsPresenter);
    bookListPresenter = testHarness.container.get(BookListPresenter);
    booksRepository = testHarness.container.get(BooksRepository);
    booksGateway = booksRepository?.dataGateway;
    authorsGateway = authorsPresenter?.authorsRepository?.dataGateway;
    dynamicBookNamesStack = ["new book", "bookA", "bookB", "bookC"];
    dynamicBookIdStack = [5, 4, 3, 2, 1];

    if (!booksGateway || !authorsGateway) {
      throw new Error("gateway not found");
    }
    booksGateway.post = vi.fn().mockImplementation(() => {
      return Promise.resolve(
        GetSuccessfulBookAddedStub(dynamicBookIdStack?.pop())
      );
    });

    booksGateway.get = vi.fn().mockImplementation(() => {
      return Promise.resolve(
        SingleBookResultStub(
          dynamicBookNamesStack?.pop(),
          dynamicBookIdStack?.pop()
        )
      );
    });

    authorsGateway.post = vi.fn().mockImplementation(() => {
      return Promise.resolve(GetSuccessfulAuthorAddedStub());
    });

    authorsGateway.get = vi.fn().mockImplementation(() => {
      return Promise.resolve(SingleAuthorsResultStub());
    });
  });

  describe("loading", async () => {
    it("should load list author and books into ViewModel", async () => {
      await authorsPresenter?.load();

      expect(authorsPresenter?.viewModel.length > 0).toBe(true);
      expect(authorsPresenter?.viewModel).toEqual([
        {
          authorId: 1,
          bookIds: [1, 2],
          latLon: "51.4556852, -0.9904706",
          name: "Isaac Asimov",
          books: [
            {
              bookId: 1,
              devOwnerId: "pete+dnd@logicroom.co",
              emailOwnerId: "g@b.com",
              name: "bookC",
            },
            {
              bookId: 2,
              devOwnerId: "pete+dnd@logicroom.co",
              emailOwnerId: "g@b.com",
              name: "bookB",
            },
          ],
        },
        {
          authorId: 2,
          bookIds: [3],
          latLon: "9,2",
          name: "Kenneth Graeme",
          books: [
            {
              bookId: 3,
              devOwnerId: "pete+dnd@logicroom.co",
              emailOwnerId: "g@b.com",
              name: "bookA",
            },
          ],
        },
      ]);
    });

    it("should show author list (toggle) when has authors", async () => {
      await authorsPresenter?.load();
      expect(authorsPresenter?.showToggle).toBe(true);
    });
    it("should hide author list (toggle) when has no authors", async () => {
      // set stub to return no authors
      if (!authorsGateway) throw new Error("authorsGateway not found");
      authorsGateway.get = vi.fn().mockImplementation(() => {
        return Promise.resolve(NoAuthorsResultStub());
      });
      // load authors
      await authorsPresenter?.load();
      // no authors => no toggle
      expect(authorsPresenter?.showToggle).toBe(false);
    });

    it("should set buffer mode to true, so the in-memory books list is read", async () => {
      await authorsPresenter?.load();
      expect(booksRepository?.bufferMode).toBe(true);
    });
  });

  describe("saving", () => {
    it("should add a book to the list of books to be added", async () => {
      if (!authorsPresenter) throw new Error("authorsPresenter not found");
      await authorsPresenter?.load();

      // set up new author and book
      authorsPresenter.newAuthorName = "new author";
      authorsPresenter.newBookTitle = "new book";
      authorsPresenter.addBook();

      //book list presenter should have new book,
      expect(bookListPresenter?.viewModel).toEqual([
        {
          emailOwnerId: "a@b.com",
          id: 0,
          name: "new book",
        },
      ]);
    });

    it("should add multiple books to the list of books to be added", async () => {
      if (!authorsPresenter) throw new Error("authorsPresenter not found");
      await authorsPresenter?.load();

      // set up new author and book
      authorsPresenter.newAuthorName = "new author";
      authorsPresenter.newBookTitle = "new book";
      authorsPresenter.addBook();
      authorsPresenter.newBookTitle = "new book 2";
      authorsPresenter.addBook();
      authorsPresenter.newBookTitle = "new book 3";
      authorsPresenter.addBook();

      //book list presenter should have new book,
      expect(bookListPresenter?.viewModel).toEqual([
        {
          emailOwnerId: "a@b.com",
          id: 0,
          name: "new book",
        },
        {
          emailOwnerId: "a@b.com",
          id: 0,
          name: "new book 2",
        },
        {
          emailOwnerId: "a@b.com",
          id: 0,
          name: "new book 3",
        },
      ]);
    });

    it("should clear the books buffer", async () => {
      if (!authorsPresenter) throw new Error("authorsPresenter not found");
      await authorsPresenter?.load();

      // set up new author and book
      authorsPresenter.newAuthorName = "new author";
      authorsPresenter.newBookTitle = "new book";
      authorsPresenter.addBook();

      //book list presenter should have new book,
      expect(bookListPresenter?.viewModel).toEqual([
        {
          emailOwnerId: "a@b.com",
          id: 0,
          name: "new book",
        },
      ]);

      //clear inputs
      authorsPresenter.clearInputs();

      // book list should be empty
      expect(bookListPresenter?.viewModel).toEqual([]);
    });

    it("should allow single author to be added and will reload authors list", async () => {
      await authorsPresenter?.load();
      //anchor
      expect(authorsPresenter?.viewModel.length).toBe(2);
      //pivot - add one author w/ one book
      const authorTestHarness = new AuthorTestHarness(testHarness);
      await authorTestHarness.addAuthorWithBook();

      //test after pivot
      expect(authorsPresenter?.viewModel.length).toBe(3);
      expect(authorsPresenter?.viewModel[2]).toEqual({
        authorId: 3,
        bookIds: [4],
        books: [
          {
            bookId: 4,
            devOwnerId: "pete+dnd@logicroom.co",
            emailOwnerId: "g@b.com",
            name: "new book",
          },
        ],
        latLon: "19,22",
        name: "new author",
      });
    });

    it("correctly add author with two books", async () => {
      await authorsPresenter?.load();
      //anchor
      expect(authorsPresenter?.viewModel.length).toBe(2);
      //pivot - add one author w/ one book
      const authorTestHarness = new AuthorTestHarness(testHarness);
      await authorTestHarness.addAuthorWithTwoBooks();

      //test after pivot
      expect(authorsPresenter?.viewModel.length).toBe(3);
      expect(authorsPresenter?.viewModel[2]).toEqual({
        authorId: 3,
        bookIds: [4, 5],
        books: [
          {
            bookId: 4,
            devOwnerId: "pete+dnd@logicroom.co",
            emailOwnerId: "g@b.com",
            name: "second book",
          },
          {
            bookId: 5,
            devOwnerId: "pete+dnd@logicroom.co",
            emailOwnerId: "g@b.com",
            name: "first book",
          },
        ],
        latLon: "19,22",
        name: "new author",
      });
    });
  });
});
