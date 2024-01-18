import React from "react";
import { ApplicationList } from "./Components/ApplicationList";

const Applications = (): React.ReactElement => {
  return (
    <>
      <h1>Applications</h1>
      <p>Here you should see a list of job applications</p>
      <ApplicationList />
    </>
  );
};

export default Applications;
