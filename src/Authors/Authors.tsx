import { observer } from  'mobx-react'
import { withInjection } from '../Core/Providers/Injection';
// import { AuthorsPresenter } from '../Authors/AuthorsPresenter';

const AuthorsComp = observer((props) => {
    return (
        <div>
            <h1>Authors</h1>
            {/* <ul>
                {props.authorsPresenter.viewModel.authors.map((author) => (
                    <li key={author.id}>{author.name}</li>
                ))}
            </ul> */}
        </div>
    )
})

export const Authors = withInjection({
    // authorsPresenter: AuthorsPresenter
})(AuthorsComp)