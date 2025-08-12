import { NavLink } from 'react-router-dom'
import { useChainLoader } from '../../route/loaderData'
import logo from '../../assets/me.png'

export default function HomeButton() {
  const { currentChainInfo } = useChainLoader()
  return (
    <NavLink
      to={`/?swap_chain=${currentChainInfo.internalName}`}
      className="flex flex-row items-center gap-1"
    >
      <div className="relative">
        <img className="size-10" alt="Me Icon" src={logo} />
      </div>
    </NavLink>
  )
}
