import { observer } from "mobx-react";
import classes from "./ApplicationList.module.css";
import { ApplicationsPresenter } from "../../ApplicationsPresenter";

export const ApplicationList = observer(({ presenter }: { presenter: ApplicationsPresenter}) => {
  const handleRemove = (id: number) => {
    presenter.removeApplication(id);
  };
  const handleSaveStatus = (id: number) => {
    presenter.saveStatus(id);
  };
  return (
    <>
      <div className={classes.summary}>
        <button
          onClick={() => {
            presenter.updateFilteredStatuses(presenter.activeStatuses);
          }}
        >
          Active: {presenter.activeApplications.length}
        </button>
        <button
          onClick={() => {
            presenter.updateFilteredStatuses(presenter.idleStatuses);
          }}
        >
          Idle: {presenter.idleApplications.length}
        </button>
        <button
          onClick={() => {
            presenter.updateFilteredStatuses(presenter.unsuccessfulStatuses);
          }}
        >
          Archived: {presenter.unsuccessfulApplications.length}
        </button>
        <button
          onClick={() => {
            presenter.updateFilteredStatuses([]);
          }}
        >
          Total: {presenter.totalApplications}
        </button>
      </div>
      <div className={classes.applicationsGrid}>
        {presenter.filteredApplications.map((application, idx) => {
          const applicationId = application.id ? application.id : 0;
          return (
            <div className={classes.applicationCard} key={idx}>
              <p>
                {application.jobTitle} @ {application.company}
              </p>
              <p>status: {application.statuses.slice(-1)[0]?.status}</p>
              <p>{application.location}</p>
              <a
                target="_blank"
                rel="noreferrer"
                href={application.jobDescriptionLink}
              >
                Job description
              </a>
              <button
                className={classes.seeNotes}
                onClick={() => presenter.openModalWithNotes(applicationId)}
              >
                Notes
              </button>
              <p>
                {new Date(application.appliedDate).toLocaleDateString()} - id:{" "}
                {application.id}
              </p>
              <div>
                <label htmlFor={"status" + application.id}>
                  Change status:
                </label>
                <div className={classes.selectWithButton}>
                  <select
                    name="status"
                    id={"status" + application.id}
                    onChange={(e) =>
                      presenter.changeStatus(applicationId, e.target.value)
                    }
                    value={presenter.getBufferedStatus(applicationId)}
                  >
                    {presenter.statuses.map((status, idx) => (
                      <option key={status + idx} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleSaveStatus(applicationId)}>
                    Save
                  </button>
                </div>
              </div>
              <div className={classes.buttonGroup}>
                <button onClick={() => handleRemove(applicationId)}>
                  {presenter.getDeleteButtonText(applicationId)}
                </button>
                {presenter.isPredeleted(applicationId) && (
                  <button
                    onClick={() => presenter.restorePredeleted(applicationId)}
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
