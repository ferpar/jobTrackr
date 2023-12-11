import "reflect-metadata";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { Types } from "../Core/Types";
import { AppTestHarness } from "../TestTools/AppTestHarness";
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub";
import { BooksResultStub } from "../TestTools/BooksResultStub";
import { BooksPresenter } from "./BooksPresenter";
import { BookListPresenter } from "./BookList/BookListPresenter";
import { BooksRepository } from "./BooksRepository";
import { Router } from "../Routing/Router";

let testHarness: AppTestHarness | null = null;
let dataGateway: any = null;
let booksPresenter: BooksPresenter | null = null;
let bookListPresenter: BookListPresenter | null = null;
let booksRepository: BooksRepository | null = null;
let router: Router | null = null;

describe("books feature", () => {
  beforeEach(async () => {
    testHarness = new AppTestHarness();
    testHarness.init();
    booksPresenter = testHarness.container.get(BooksPresenter);
    bookListPresenter = testHarness.container.get(BookListPresenter);
    booksRepository = testHarness.container.get(BooksRepository);
    dataGateway = booksRepository?.dataGateway;
    router = testHarness.container.get(Router);

    testHarness.bootstrap();
    await testHarness.setupLogin(GetSuccessfulUserLoginStub);
    ``;
  });

  describe("loading", () => {
    it("should show book list", async () => {
      // stub the dataGateway.get method to force successful response
      dataGateway.get = vi.fn().mockImplementation(async () => {
        return await Promise.resolve(BooksResultStub());
      });
      // initally the book list is empty
      expect(bookListPresenter?.viewModel.length).toBe(0);

      // move to books route
      await router?.goToId("booksLink");
      expect(booksPresenter?.messagePm).toBe("LOADING");
      expect(dataGateway.get).toHaveBeenCalled();
      await vi.waitUntil(() => booksPresenter?.messagePm === "LOADED");
      expect(booksPresenter?.messagePm).toBe("LOADED");
      expect(bookListPresenter?.viewModel).toEqual([
        {
          bookId: 881,
          devOwnerId: "pete@logicroom.co",
          emailOwnerId: "a@b.com",
          name: "Wind in the willows",
        },
        {
          bookId: 891,
          devOwnerId: "pete@logicroom.co",
          emailOwnerId: "a@b.com",
          name: "I, Robot",
        },
        {
          bookId: 901,
          devOwnerId: "pete@logicroom.co",
          emailOwnerId: "a@b.com",
          name: "The Hobbit",
        },
        {
          bookId: 911,
          devOwnerId: "pete@logicroom.co",
          emailOwnerId: "a@b.com",
          name: "Wind In The Willows 2",
        },
      ]);
    });
  });

  //   describe("saving", () => {
  // beforeEach(async () => {
  // })
  // it('should reload books list', async () => {})
  // it('should update books message', async () => {})
  //   });
});
