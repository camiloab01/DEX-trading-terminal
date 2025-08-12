export const Divider = ({ containerClasses, lineClasses }: { containerClasses?: string; lineClasses?: string }) => (
  <div className={containerClasses}>
    <div className={`w-full y-1 h-[1px] bg-gray-750 ${lineClasses}`} />
  </div>
)
