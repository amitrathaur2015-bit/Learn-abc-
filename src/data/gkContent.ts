import type { GkTopic } from './models'

export const GK_TOPICS: GkTopic[] = [
  {
    id: 'animals',
    title: 'Animals',
    emoji: '🐾',
    items: [
      { name: 'Lion', emoji: '🦁' },
      { name: 'Elephant', emoji: '🐘' },
      { name: 'Tiger', emoji: '🐯' },
      { name: 'Monkey', emoji: '🐒' },
      { name: 'Rabbit', emoji: '🐰' },
      { name: 'Cow', emoji: '🐄' }
    ]
  },
  {
    id: 'birds',
    title: 'Birds',
    emoji: '🐦',
    items: [
      { name: 'Parrot', emoji: '🦜' },
      { name: 'Peacock', emoji: '🦚' },
      { name: 'Sparrow', emoji: '🐦' },
      { name: 'Crow', emoji: '🐦\u200d⬛' },
      { name: 'Duck', emoji: '🦆' }
    ]
  },
  {
    id: 'fruits',
    title: 'Fruits',
    emoji: '🍎',
    items: [
      { name: 'Apple', emoji: '🍎' },
      { name: 'Banana', emoji: '🍌' },
      { name: 'Mango', emoji: '🥭' },
      { name: 'Grapes', emoji: '🍇' },
      { name: 'Orange', emoji: '🍊' }
    ]
  },
  {
    id: 'vegetables',
    title: 'Vegetables',
    emoji: '🥕',
    items: [
      { name: 'Carrot', emoji: '🥕' },
      { name: 'Potato', emoji: '🥔' },
      { name: 'Tomato', emoji: '🍅' },
      { name: 'Brinjal', emoji: '🍆' },
      { name: 'Onion', emoji: '🧅' }
    ]
  },
  {
    id: 'body',
    title: 'Body Parts',
    emoji: '🧍',
    items: [
      { name: 'Eyes', emoji: '👀' },
      { name: 'Nose', emoji: '👃' },
      { name: 'Ears', emoji: '👂' },
      { name: 'Hands', emoji: '✋' },
      { name: 'Legs', emoji: '🦵' }
    ]
  },
  {
    id: 'vehicles',
    title: 'Vehicles',
    emoji: '🚗',
    items: [
      { name: 'Car', emoji: '🚗' },
      { name: 'Bus', emoji: '🚌' },
      { name: 'Train', emoji: '🚆' },
      { name: 'Airplane', emoji: '✈️' },
      { name: 'Bicycle', emoji: '🚲' }
    ]
  },
  {
    id: 'days',
    title: 'Days of the Week',
    emoji: '📅',
    items: [
      { name: 'Monday', emoji: '1️⃣' },
      { name: 'Tuesday', emoji: '2️⃣' },
      { name: 'Wednesday', emoji: '3️⃣' },
      { name: 'Thursday', emoji: '4️⃣' },
      { name: 'Friday', emoji: '5️⃣' },
      { name: 'Saturday', emoji: '6️⃣' },
      { name: 'Sunday', emoji: '7️⃣' }
    ]
  },
  {
    id: 'months',
    title: 'Months',
    emoji: '🗓️',
    items: [
      { name: 'January', emoji: '❄️' },
      { name: 'April', emoji: '🌸' },
      { name: 'July', emoji: '🌧️' },
      { name: 'October', emoji: '🍁' },
      { name: 'December', emoji: '🎄' }
    ]
  },
  {
    id: 'seasons',
    title: 'Seasons',
    emoji: '🌦️',
    items: [
      { name: 'Summer', emoji: '☀️' },
      { name: 'Monsoon', emoji: '🌧️' },
      { name: 'Winter', emoji: '❄️' },
      { name: 'Spring', emoji: '🌸' }
    ]
  },
  {
    id: 'india',
    title: 'About India',
    emoji: '🇮🇳',
    items: [
      { name: 'National Flag', emoji: '🇮🇳' },
      { name: 'National Animal - Tiger', emoji: '🐯' },
      { name: 'National Bird - Peacock', emoji: '🦚' },
      { name: 'National Flower - Lotus', emoji: '🪷' },
      { name: 'Capital - New Delhi', emoji: '🏛️' }
    ]
  }
]

// Full topic browsing works for all topics above. A tap-to-answer quiz is
// wired up for these two as a working example of the pattern - more topics
// can get a quiz the same way in Part 3.
export const GK_QUIZ_TOPICS = new Set(['animals', 'fruits'])

export function makeGkQuiz(topicId: string) {
  const topic = GK_TOPICS.find((t) => t.id === topicId)
  if (!topic) return []
  return topic.items.slice(0, 4).map((item, i) => {
    const others = topic.items.filter((x) => x.name !== item.name)
    const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, 2)
    const options = [item, ...distractors].sort(() => Math.random() - 0.5)
    return {
      id: `${topicId}-${i}`,
      prompt: `Which one is the ${item.name}?`,
      options: options.map((o) => ({ id: o.name, label: o.name, emoji: o.emoji })),
      correctId: item.name
    }
  })
}
