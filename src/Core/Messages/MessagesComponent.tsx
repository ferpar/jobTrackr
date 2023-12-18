import { observer } from 'mobx-react'
import { MessagesPresenter } from './MessagesPresenter'
import { withInjection } from '../Providers/withInjection'
import { useValidation } from '../Providers/useValidation'

export const MessagesComp = observer((props) => {
  const [uiMessages] = useValidation()

  return (
    <>
      {props.presenter.messages &&
        props.presenter.messages.map((item, i) => {
          return (
            <div style={{ backgroundColor: 'red' }} key={i}>
              {' - '}
              {item}
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
