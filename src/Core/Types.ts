export const Types = {
  IRouterGateway: Symbol.for("IRouterGateway"),
  IDataGateway: Symbol.for("IDataGateway"),
  ILocalStorageGateway: Symbol.for("ILocalStorageGateway"),
  IAuthGateway: Symbol.for("IAuthGateway"),
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

export type JobApplicationStatus = {
  statusId: string;
  applicationId: string;
  status: string;
  statusDate: string;
  notes: string;
}

export type JobApplication = {
  id?: string;
  userId?: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  contactPerson?: string;
  contactEmail?: string;
  notes: string;
  resumeLink?: string;
  jobDescriptionLink?: string;
  statuses: JobApplicationStatus[];
}