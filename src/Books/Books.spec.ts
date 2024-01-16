import "reflect-metadata";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { AppTestHarness } from "../TestTools/AppTestHarness";
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub";
import { BooksResultStub } from "../TestTools/BooksResultStub";
import { BooksPresenter } from "./BooksPresenter";
import { BookListPresenter } from "./BookList/BookListPresenter";
import { BooksRepository } from "./BooksRepository";
import { Router } from "../Routing/Router";
import { GetSuccessfulBookAddedStub } from "../TestTools/GetSuccessfulBookAddedStub";
import IDataGateway from "../Core/IDataGateway";

let testHarness: AppTestHarness | null = null;
let dataGateway: IDataGateway | null = null;
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
    const authenticationPresenter = await testHarness.setupLogin(
      GetSuccessfulUserLoginStub
    );
    authenticationPresenter.email = "a@b.com";
    authenticationPresenter.password = "1234";
    authenticationPresenter.option = "login";
    await authenticationPresenter.login();
    ``;
  });

  describe("loading", () => {
    it("should show book list", async () => {
      // stub the dataGateway.get method to force successful response
      if (!dataGateway) throw new Error("dataGateway not found");
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

  describe("saving (adding books)", () => {
    beforeEach(async () => {
      if (!dataGateway) throw new Error("dataGateway not found");
      dataGateway.get = vi.fn().mockImplementation(async () => {
        return await Promise.resolve(BooksResultStub());
      });
      dataGateway.post = vi.fn().mockImplementation(async () => {
        return await Promise.resolve(GetSuccessfulBookAddedStub());
      });
    });
    it("should reload books list", async () => {
      if (!dataGateway) throw new Error("dataGateway not found");
      expect(bookListPresenter?.viewModel.length).toBe(0);
      if (booksPresenter) booksPresenter.newBookTitle = "new book";
      await booksPresenter?.addBook();
      expect(dataGateway.post).toHaveBeenCalledWith("/books", {
        name: "new book",
        emailOwnerId: booksRepository?.userModel.email,
      });
      expect(booksPresenter?.viewModel).toEqual([
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
    it("should update books message", async () => {
      if (!dataGateway) throw new Error("dataGateway not found");
      expect(booksPresenter?.messagePm).toBe("UNSET");
      if (booksPresenter) booksPresenter.newBookTitle = "new book";
      await booksPresenter?.addBook();
      expect(dataGateway.post).toHaveBeenCalledWith("/books", {
        name: "new book",
        emailOwnerId: booksRepository?.userModel.email,
      });
      expect(booksPresenter?.messagePm).toBe("ADDED");
    });
    it("should update the last added book string", async () => {
      expect(booksPresenter?.lastAddedBook).toBe(null);
      if (booksPresenter) booksPresenter.newBookTitle = "new book";
      await booksPresenter?.addBook();
      expect(booksPresenter?.lastAddedBook).toBe("new book");
    });
    it("should clear the new book title", async () => {
      if (booksPresenter) booksPresenter.newBookTitle = "new book";
      await booksPresenter?.addBook();
      expect(booksPresenter?.newBookTitle).toBe("");
    });
  });
});
