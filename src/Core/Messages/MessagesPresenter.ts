import { injectable, inject } from "inversify";
import { makeObservable, observable, action, computed } from "mobx";
import { MessagesRepository,  } from "./MessagesRepository";
import { PackedMessage } from "./MessagePacking";

@injectable()
export class MessagesPresenter {
  @inject(MessagesRepository)
  messagesRepository: MessagesRepository;

  showValidationWarning: boolean | null = null;

  get messages() {
    return this.messagesRepository.appMessages;
  }

  constructor() {
    makeObservable(this, {
      showValidationWarning: observable,
      messages: computed,
      unpackRepositoryPmToVm: action,
    });
  }

  init = () => {
    this.showValidationWarning = false;
  };

  unpackRepositoryPmToVm = (pm: PackedMessage, userMessage: string) => {
    this.showValidationWarning = !pm.success;
    this.messagesRepository.appMessages = pm.success
      ? [{message: userMessage, success: true}]
      : [{message: pm.serverMessage, success: false}];
  };
}
