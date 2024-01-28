import { observer } from "mobx-react";
import classes from "./ApplicationList.module.css";

export const ApplicationList = observer(({ presenter }) => {
  const handleRemove = (id) => {
    presenter.removeApplication(id);
  };
  const handleSaveStatus = (id) => {
    presenter.saveStatus(id);
  };
  return (
    <>
    <div className={classes.summary}>
    <p>Total applications: {presenter.totalApplications}</p>
    </div>
    <div className={classes.applicationsGrid}>
      {presenter.viewModel.map((application, idx) => {
        return (
          <div className={classes.applicationCard} key={idx}>
            <p>
              {application.jobtitle} @ {application.company}
            </p>
            <p>status: {application.statuses.slice(-1)[0]?.status}</p>
            <p>{application.location}</p>
            <a href={application.jobdescriptionlink}>Job description</a>
            <button className={classes.seeNotes} onClick={() => presenter.openModalWithNotes(application.id)}>Notes</button>
            <p>
              {new Date(application.applieddate).toLocaleDateString()} - id:{" "}
              {application.id}
            </p>
            <div>
              <label htmlFor={"status" + application.id}>Change status:</label>
              <div className={classes.selectWithButton}>
                <select
                  name="status"
                  id={"status" + application.id}
                  onChange={(e) =>
                    presenter.changeStatus(application.id, e.target.value)
                  }
                  value={presenter.getBufferedStatus(application.id)}
                >
                  {presenter.statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleSaveStatus(application.id)}>
                  Save
                </button>
              </div>
            </div>
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
    </>
  );
});
