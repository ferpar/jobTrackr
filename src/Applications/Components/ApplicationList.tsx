import { observer } from "mobx-react";
import classes from "./ApplicationList.module.css";

export const ApplicationList = observer(({ presenter }) => {
  const handleRemove = (id) => {
    presenter.removeApplication(id);
  };
  return (
    <div className={classes.applicationsGrid}>
      {presenter.viewModel.map((application, idx) => {
        return (
          <div className={classes.applicationCard} key={idx}>
            <p>
              {application.jobtitle} @ {application.company}
            </p>
            <p>
              status:{" "}
              {application.statuses[application.statuses.length - 1]?.status}
            </p>
            <p></p>
            <p>
              {new Date(application.applieddate).toLocaleDateString()} - id:{" "}
              {application.id}
            </p>
            <div className={classes.buttonGroup}>
              <button onClick={() => handleRemove(application.id)}>
                {presenter.getDeleteButtonText(application.id)}
              </button>
              {presenter.isPredeleted(application.id) && (
                <button
                  onClick={() => presenter.restorePredeleted(application.id)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
