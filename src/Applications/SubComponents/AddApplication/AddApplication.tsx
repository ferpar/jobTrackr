import { observer } from "mobx-react";
import classes from "./AddApplication.module.css";
import { ApplicationsPresenter } from "../../ApplicationsPresenter";

export const AddApplication = observer(({ presenter }: { presenter: ApplicationsPresenter}) => {
  const handleOnSubmit = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    presenter.addApplication();
  };
  return presenter.showApplicationForm ? (
    <form className={classes.formContainer} onSubmit={handleOnSubmit}>
      <div className={classes.inputGroup}>
        <input
          type="text"
          placeholder="Job Title"
          value={presenter.newApplication.jobTitle}
          onChange={(event) => {
            presenter.newApplication.jobTitle = event.target.value;
          }}
        />
        <input
          type="text"
          placeholder="Company"
          value={presenter.newApplication.company}
          onChange={(event) =>
            (presenter.newApplication.company = event.target.value)
          }
        />
        <input
          type="text"
          placeholder="Location"
          value={presenter.newApplication.location}
          onChange={(event) =>
            (presenter.newApplication.location = event.target.value)
          }
        />
        <input
          type="date"
          className={classes.dateInput}
          value={presenter.formattedDate}
          onChange={(event) =>
            (presenter.newApplication.appliedDate = new Date(
              event.target.value
            ).toISOString())
          }
        />
      </div>

      <div className={classes.notesGroup}>
        <input
          className={classes.jobDescriptionLink}
          type="text"
          placeholder="Job description link"
          value={presenter.newApplication.jobDescriptionLink}
          onChange={(event) => {
            presenter.newApplication.jobDescriptionLink = event.target.value;
          }}
        />
        <textarea
          className={classes.notes}
          placeholder="Notes"
          value={presenter.newApplication.notes}
          onChange={(event) =>
            (presenter.newApplication.notes = event.target.value)
          }
        />
      </div>
      <div className={classes.inputGroup}>
        <input
          type="text"
          placeholder="resume link"
          value={presenter.newApplication.resumeLink}
          onChange={(event) =>
            (presenter.newApplication.resumeLink = event.target.value)
          }
        />
        <input
          type="text"
          placeholder="contact person"
          value={presenter.newApplication.contactPerson}
          onChange={(event) =>
            (presenter.newApplication.contactPerson = event.target.value)
          }
        />
        <input
          type="text"
          placeholder="contact email"
          value={presenter.newApplication.contactEmail}
          onChange={(event) =>
            (presenter.newApplication.contactEmail = event.target.value)
          }
        />
      </div>

      <div className={classes.inputGroup}>
        <button type="submit">Add Application</button>
        <button
          className={classes.cancelAdd}
          onClick={() => presenter.toggleApplicationForm()}
        >
          Cancel
        </button>
      </div>
    </form>
  ) : (
    <div className={classes.addApplicationContainer}>
      <button onClick={() => presenter.toggleApplicationForm()}>
        Add Application
      </button>
    </div>
  );
});
