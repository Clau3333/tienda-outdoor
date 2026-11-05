import type { CategoryKey } from './navigation'

type MenuState = { category: CategoryKey | null; locationKey: string }
type MenuAction =
  | { type: 'toggle'; category: CategoryKey; locationKey: string }
  | { type: 'navigate'; locationKey: string }
  | { type: 'close' }

export function initialMenuState(locationKey: string): MenuState {
  return { category: null, locationKey }
}

export function categoryMenuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case 'toggle':
      return {
        category: state.locationKey === action.locationKey && state.category === action.category
          ? null : action.category,
        locationKey: action.locationKey,
      }
    case 'navigate':
      return initialMenuState(action.locationKey)
    case 'close':
      return state.category === null ? state : { ...state, category: null }
  }
}
