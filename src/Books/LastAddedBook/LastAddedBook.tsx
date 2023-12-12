import { observer } from 'mobx-react';

export const LastAddedBook = observer(({lastAddedBook}) => {
    console.log('lastAddedBook',lastAddedBook)
    return (
        <p>Last Added Book : {lastAddedBook}</p>
    )
})