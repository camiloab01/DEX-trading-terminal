import { colors } from '../constants/colors'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
const lostCloud = 'https://assets.oku.trade/404cloud.svg'

export const NotFound404 = () => {
  return (
    <div className="md:flex my-auto mx-auto">
      <img alt="Not found" src={lostCloud}></img>
      <div className="md:mt-24 md:ml-20 text-center md:text-left">
        <h1 style={{ fontWeight: '800', fontSize: '64px', color: colors.gray[200] }}>404</h1>
        <p style={{ fontWeight: '400', fontSize: '24px', color: colors.gray[300] }}>
          Can&apos;t find what you&apos;re looking for!{' '}
        </p>
        <Link
          to={`/`}
          className="hover:opacity-100 opacity-80 text-blue-400 py-2 px-2 border border-blue-400 rounded-lg shadow mt-4 inline-flex items-center"
          relative="route"
        >
          <span className="mr-1">Take me back home</span>
          <ReactSVG
            style={{ color: colors.blue[400], strokeWidth: 1.5 }}
            src="https://assets.oku.trade/rightArrowIcon.svg"
          />
        </Link>
      </div>
    </div>
  )
}
