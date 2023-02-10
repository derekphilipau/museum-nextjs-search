import { FilterOption } from "./filterOption"

export interface Filter {
  name: string
  displayName: string
  options: Array<FilterOption>
}
