import React from "react";
import { ApplicationList } from "./SubComponents/ApplicationList/ApplicationList";
import { AddApplication } from "./SubComponents/ApplicationList/AddApplication";
import { useInjection } from "../Core/Providers/useInjection";
import { ApplicationsPresenter } from "./ApplicationsPresenter";

const Applications = (): React.ReactElement => {
  const presenter: ApplicationsPresenter = useInjection(
    ApplicationsPresenter
  ) as ApplicationsPresenter;
  return (
    <>
      <h1>Applications</h1>
      <AddApplication presenter={presenter} />
      <ApplicationList presenter={presenter}/>
    </>
  );
};

export default Applications;
