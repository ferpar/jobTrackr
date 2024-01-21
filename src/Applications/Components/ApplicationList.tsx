import { observer } from "mobx-react";
import classes from './ApplicationList.module.css'

export const ApplicationList = observer(({ presenter }) => {
  return (
    <div className={classes.applicationsGrid}>
      {presenter.viewModel.map((application, idx) => {
        return (
          <div className={classes.applicationCard} key={idx}>
            <p>company: {application.company}</p>
            <p>position: {application.jobtitle}</p>
            <p>
              date: {new Date(application.applieddate).toLocaleDateString()}
            </p>
            <p>
              status:{" "}
              {application.statuses[application.statuses.length - 1]?.status}
            </p>
            <p>application id: {application.id}</p>
          </div>
        );
      })}
    </div>
  );
});
