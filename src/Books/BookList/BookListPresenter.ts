import { injectable, inject } from "inversify";
import { makeObservable, computed } from "mobx";
import { BooksRepository } from "../BooksRepository";

@injectable()
export class BookListPresenter {
  @inject(BooksRepository)
  booksRepository;

  get viewModel() {
    const bufferMode = this.booksRepository.bufferMode;
    if (bufferMode) {
      return this.booksRepository.bookBuffer;
    }
    return this.booksRepository.books;
  }

  constructor() {
    makeObservable(this, {
      viewModel: computed,
    });
  }
}
