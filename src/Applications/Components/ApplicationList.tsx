import { observer } from "mobx-react";

export const ApplicationList = observer(({ presenter }) => {
  return (
    <ul>
      {presenter.viewModel.map((application, idx) => {
        console.log(application.appliedDate);
        return (
          <li key={idx}>
            <div>
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
          </li>
        );
      })}
    </ul>
  );
});
