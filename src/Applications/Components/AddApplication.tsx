import { observer } from "mobx-react";

export const AddApplication = observer(({ presenter }) => {
  const handleOnSubmit = (event) => {
    event.preventDefault();
    presenter.addApplication();
  };
  return (
    <form onSubmit={handleOnSubmit}>
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
        value={presenter.formattedDate}
        onChange={(event) =>
          (presenter.newApplication.appliedDate = new Date(
            event.target.value
          ).toISOString())
        }
      />
      <input
        type="text"
        placeholder="job description link"
        value={presenter.newApplication.jobDescriptionLink}
        onChange={(event) => {
          presenter.newApplication.jobDescriptionLink = event.target.value;
        }}
      />
      <input
        type="textarea"
        placeholder="Notes"
        value={presenter.newApplication.notes}
        onChange={(event) =>
          (presenter.newApplication.notes = event.target.value)
        }
      />
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

      <button type="submit">Add Application</button>
    </form>
  );
});
