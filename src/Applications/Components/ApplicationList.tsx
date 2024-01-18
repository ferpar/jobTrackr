import { observer } from 'mobx-react';

export const ApplicationList = observer( ({presenter}) => {
    return (
        <ul>
            {presenter.viewModel.map((application, idx) => (
                <li key={idx}>
                    <div>
                    <p>company: {application.company}</p>
                    <p>position: {application.jonTitle}</p>
                    <p>date: {application.appliedDate}</p>
                    <p>status: {application.statuses[application.statuses.length -1].status}</p>
                    {application.id}
                    </div>
                    </li>
            )
            )}
        </ul>
    )
})