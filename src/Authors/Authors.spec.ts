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
    dynamicBookNamesStack = ["bookA", "bookB", "bookC"];
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
  });

  describe.skip("saving", () => {
    it("should allow single author to be added and will relaod authors list", async () => {});
  });
});
