import { injectable, inject } from "inversify";
import { Config } from "../Core/Config";
import { makeObservable, observable } from "mobx";
import { Types, JobApplication, JobApplicationDto } from "../Core/Types";
import { UserModel } from "../Authentication/UserModel";

type ApplicationsDto = {
  success: true,
  result: {
    message?: string
    data: JobApplicationDto[];
  };
} | {
  success: false,
  result: {
    message: string
  }
}

interface IApplicationsGateway {
  get: (url: string) => Promise<ApplicationsDto>;
  post: (url: string, requestDto: object) => Promise<ApplicationsDto>;
  delete: (url: string) => Promise<ApplicationsDto>;
}

const adaptJobApplicationDtoToJobApplication = (dto: JobApplicationDto): JobApplication => {
  return {
    id: dto.id,
    userId: dto.userid,
    jobTitle: dto.jobtitle,
    company: dto.company,
    location: dto.location,
    appliedDate: dto.applieddate,
    contactPerson: dto.contactperson,
    contactEmail: dto.contactemail,
    notes: dto.notes,
    resumeLink: dto.resumelink,
    jobDescriptionLink: dto.jobdescriptionlink,
    statuses: dto.statuses,
  };
}

@injectable()
export class ApplicationsRepository {
  @inject(Types.IDataGateway)
  dataGateway: IApplicationsGateway;

  @inject(UserModel)
  userModel: UserModel;

  @inject(Config)
  config: Config;

  messagePm = "UNSET";

  applications: JobApplication[] = [];

  constructor() {
    makeObservable(this, {
      messagePm: observable,
      applications: observable,
    });
  }

  load = async ():Promise<({
    success: true,
    serverMessage: string
  } | {
    success: false,
    serverMessage: string
  })> => {
    this.messagePm = "LOADING";
    const applicationsResponse = await this.dataGateway.get("/applications");
    if (applicationsResponse.success === false) {
      this.messagePm = "ERROR";
      return { success: false, serverMessage: applicationsResponse.result.message };
    }
    this.applications = applicationsResponse.result.data.map(adaptJobApplicationDtoToJobApplication);
    this.messagePm = "LOADED";
    return { success: true, serverMessage: "Applications loaded"};
  };

  reset = () => {
    this.messagePm = "RESET";
    this.applications = [];
  };

  addApplication = async (application: object) => {
    this.messagePm = "ADDING";
    const addApplicationPm = await this.dataGateway.post(
      "/applications",
      application
    );
    this.messagePm = "ADDED";
    await this.load();
    const packedMessage = {
      success: addApplicationPm.success,
      serverMessage: addApplicationPm.result.message ? addApplicationPm.result.message : "Application added",
    };
    return packedMessage;
  };

  removeApplication = async (applicationId: number) => {
    this.messagePm = "DELETING";
    const removeApplicationPm = await this.dataGateway.delete(
      "/applications/" + String(applicationId)
    );
    this.messagePm = "DELETED";
    await this.load();
    const packedMessage = {
      success: removeApplicationPm.success,
      serverMessage: removeApplicationPm.result.message ? removeApplicationPm.result.message : "Application deleted",
    };
    return packedMessage;
  };

  saveStatus = async (statusData: {
    applicationId: number;
    status: string;
  }) => {
    const { applicationId, status } = statusData;
    this.messagePm = "SAVING";
    const saveStatusPm = await this.dataGateway.post(
      "/applications/" + String(applicationId) + "/status",
      { status, statusDate: new Date().toISOString() }
    );
    this.messagePm = "SAVED";
    await this.load();
    const packedMessage = {
      success: saveStatusPm.success,
      serverMessage: saveStatusPm.result.message ? saveStatusPm.result.message : "Status saved",
    };
    return packedMessage;
  };

  filterApplications = (filter: string[]) => {
    if (filter.length === 0) {
      return this.applications;
    }
    return this.applications.filter((application: JobApplication) => {
      for (let i = 0; i < filter.length; i++) {
        const lastStatusIndex = application.statuses.length - 1;
        if (application.statuses[lastStatusIndex]?.status === filter[i]) {
          return true;
        }
      }
    });
  }
}
