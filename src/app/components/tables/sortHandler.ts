import { SortingOrder, SortingProperty } from '../../types/Enums'

const handleSorting = (
  currentProperty: SortingProperty,
  newProperty: SortingProperty,
  setSortingOrder: (value: React.SetStateAction<SortingOrder>) => void,
  setSortingProperty: (value: React.SetStateAction<SortingProperty>) => void
) => {
  if (newProperty === currentProperty) {
    setSortingOrder((currentSorting) => (currentSorting === SortingOrder.ASC ? SortingOrder.DESC : SortingOrder.ASC))
  } else {
    setSortingProperty(newProperty)
    setSortingOrder(SortingOrder.DESC)
  }
}

export default handleSorting
