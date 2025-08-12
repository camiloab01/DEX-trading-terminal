import { T2 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import useMobile from '../../hooks/useMobile'
import { FontWeightEnums } from '../../types/Enums'
import { NavLink, RelativeRoutingType } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'

export interface INavButton {
  to: string
  label: string
  end?: boolean
  relative?: RelativeRoutingType
  reloadDocument?: boolean
  target?: string
}

export default function NavButton({ label, relative, end, to, reloadDocument, target }: INavButton) {
  const { isMobile, isTablet } = useMobile()
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 md:p-[5px] lg:p-2 ${isMobile || isTablet ? 'hover:bg-gray-700' : 'hover:bg-gray-800'} rounded-lg text-gray-300 hover:text-gray-50 
  ${(isMobile || isTablet) && isActive ? 'bg-gray-800' : isActive ? 'bg-gray-800 font-medium' : ''}`
  return (
    <NavLink
      relative={relative}
      end={end}
      to={to}
      className={navLinkClass}
      reloadDocument={reloadDocument}
      target={target}
    >
      {({ isActive }) => {
        return (
          <T2
            weight={isMobile ? FontWeightEnums.MEDIUM : 'inherit'}
            color={isActive ? colors.gray[50] : 'inherit'}
            className={`whitespace-nowrap ${label === 'Analytics' || label === 'Docs' ? 'flex items-center gap-1' : ''}`}
          >
            {label}
            {label === 'Analytics' && <ArrowTopRightOnSquareIcon style={{ height: 14, width: 14 }} />}
            {label === 'Docs' && <ArrowTopRightOnSquareIcon style={{ height: 14, width: 14 }} />}
          </T2>
        )
      }}
    </NavLink>
  )
}
