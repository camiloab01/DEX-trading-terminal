interface IUserIcon {
  address: string
  size: number
}
function UserIcon({ address, size }: IUserIcon) {
  if (address.length !== 42)
    return <div style={{ width: size, height: size, borderRadius: size, backgroundColor: 'white' }}></div>

  const IconColors = []
  for (let i = 0; i < 4; i++) {
    const colorRow = []
    for (let j = 0; j < 4; j++) {
      const color = '#'.concat(address.slice(2 + (i * 4 + j) * 2, 8 + (i * 4 + j) * 2))
      colorRow.push(color)
    }
    IconColors.push(colorRow)
  }

  return (
    <div className="flex flex-col overflow-hidden" style={{ width: size, height: size, borderRadius: size }}>
      {IconColors.map((colors, indexCol) => {
        return (
          <div key={indexCol} className="flex flex-row">
            {colors.map((color, indexrow) => {
              return <div key={indexrow} style={{ width: size / 4, height: size / 4, backgroundColor: color }} />
            })}
          </div>
        )
      })}
      s
    </div>
  )
}

export default UserIcon
