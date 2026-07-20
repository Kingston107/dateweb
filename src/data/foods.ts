/** Food options — shared between FoodSelection and FinalSummary. */
export const FOODS = [
  { id: 'pizza',   emoji: '🍕', label: 'Pizza'   },
  { id: 'biryani', emoji: '🍛', label: 'Biryani' },
  { id: 'burgers', emoji: '🍔', label: 'Burgers' },
  { id: 'pasta',   emoji: '🍝', label: 'Pasta'   },
  { id: 'tacos',   emoji: '🌮', label: 'Tacos'   },
  { id: 'ramen',   emoji: '🍜', label: 'Ramen'   },
] as const

export type FoodId = typeof FOODS[number]['id']
