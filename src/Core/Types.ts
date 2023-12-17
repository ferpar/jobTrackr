export const Types = {
  IRouterGateway: Symbol.for("IRouterGateway"),
  IDataGateway: Symbol.for("IDataGateway"),
  ILocalStorageGateway: Symbol.for("ILocalStorageGateway"),
};

export type Book = {
  id: number;
  name: string;
  emailOwnerId: string;
};

export type Author = {
  id: string;
  name: string;
  emailOwnerId: string;
  books: Book[];
  bookIds: string[];
};
