import { observer } from 'mobx-react'
import { MessagesPresenter } from './MessagesPresenter'
import { withInjection } from '../Providers/withInjection'
import { useValidation } from '../Providers/useValidation'

export const MessagesComp = observer((props: {presenter: MessagesPresenter}) => {
  const [uiMessages] = useValidation()
  return (
    <>
      {props.presenter.messages &&
        props.presenter.messages.map((item, i) => {
          return (
            <div style={{ backgroundColor: !item.success ?'red' : 'green' }} key={i}>
              {' - '}
              {item.message}
            </div>
          )
        })}
      {uiMessages &&
        uiMessages.map((item, i) => {
          return (
            <div style={{ backgroundColor: 'orange' }} key={i}>
              {' - '}
              {item}
            </div>
          )
        })}
    </>
  )
})

export const MessagesComponent = withInjection({
  presenter: MessagesPresenter
})(MessagesComp)
