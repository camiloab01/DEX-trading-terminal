export default function IconButton(props: {
  onClick?: () => void
  IconComponent: React.ElementType
  iconClasses?: string
  containerClasses?: string
}) {
  const { onClick, IconComponent, iconClasses, containerClasses } = props
  return (
    <div onClick={onClick} className={`cursor-pointer hover:opacity-70 ${containerClasses}`}>
      <IconComponent className={`${iconClasses}`} />
    </div>
  )
}
