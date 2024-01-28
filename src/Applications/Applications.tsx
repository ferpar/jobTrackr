import React from "react";
import { ApplicationList } from "./SubComponents/ApplicationList/ApplicationList";
import { AddApplication } from "./SubComponents/AddApplication/AddApplication";
import { useInjection } from "../Core/Providers/useInjection";
import { ApplicationsPresenter } from "./ApplicationsPresenter";
import Modal from "../Components/Modal/Modal";

const Applications = (): React.ReactElement => {
  const presenter: ApplicationsPresenter = useInjection(
    ApplicationsPresenter
  ) as ApplicationsPresenter;
  return (
    <>
      <h1>Applications</h1>
      <AddApplication presenter={presenter} />
      <ApplicationList presenter={presenter}/>
      <Modal presenter={presenter} />
    </>
  );
};

export default Applications;
