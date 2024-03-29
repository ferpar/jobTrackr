import React from "react";
import { ApplicationList } from "./SubComponents/ApplicationList/ApplicationList";
import { AddApplication } from "./SubComponents/AddApplication/AddApplication";
import { useInjection } from "../Core/Providers/useInjection";
import { ApplicationsPresenter } from "./ApplicationsPresenter";
import ModalWrapper from "./SubComponents/ModalWrapper/ModalWrapper";


const Applications = (): React.ReactElement => {
  const presenter: ApplicationsPresenter = useInjection(
    ApplicationsPresenter
  ) as ApplicationsPresenter;
  return (
    <>
      <h1>Applications</h1>
      <AddApplication presenter={presenter} />
      <ApplicationList presenter={presenter}/>
      <ModalWrapper presenter={presenter} />
    </>
  );
};

export default Applications;
