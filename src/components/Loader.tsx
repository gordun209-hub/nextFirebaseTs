import { FC } from 'react'

type TLoader = {
  show: boolean
}
const Loader: FC<TLoader> = ({ show }) => {
  return show ? <div className='loader'></div> : null
}

export default Loader
