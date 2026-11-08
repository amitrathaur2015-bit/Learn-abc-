import type { GkTopic, QuizQuestion } from './models'

// HOW TO ADD MORE: every line like { name: 'Dog', emoji: '🐶' } is one card in the
// topic AND one more possible quiz question. Add a line inside a topic's items list
// and it shows up everywhere on its own - nothing else needs to change.
//
// Keep the first six animals as they are: the Memory Cards game uses them.

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
      { name: 'Cow', emoji: '🐄' },
      { name: 'Dog', emoji: '🐶' },
      { name: 'Cat', emoji: '🐱' },
      { name: 'Horse', emoji: '🐴' },
      { name: 'Goat', emoji: '🐐' },
      { name: 'Sheep', emoji: '🐑' },
      { name: 'Pig', emoji: '🐷' },
      { name: 'Camel', emoji: '🐫' },
      { name: 'Deer', emoji: '🦌' },
      { name: 'Bear', emoji: '🐻' },
      { name: 'Fox', emoji: '🦊' },
      { name: 'Zebra', emoji: '🦓' },
      { name: 'Giraffe', emoji: '🦒' },
      { name: 'Buffalo', emoji: '🐃' },
      { name: 'Panda', emoji: '🐼' }
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
      { name: 'Crow', emoji: '🐦‍⬛' },
      { name: 'Duck', emoji: '🦆' },
      { name: 'Owl', emoji: '🦉' },
      { name: 'Eagle', emoji: '🦅' },
      { name: 'Swan', emoji: '🦢' },
      { name: 'Hen', emoji: '🐔' },
      { name: 'Chick', emoji: '🐤' },
      { name: 'Flamingo', emoji: '🦩' },
      { name: 'Penguin', emoji: '🐧' },
      { name: 'Turkey', emoji: '🦃' },
      { name: 'Dove', emoji: '🕊️' }
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
      { name: 'Orange', emoji: '🍊' },
      { name: 'Watermelon', emoji: '🍉' },
      { name: 'Pineapple', emoji: '🍍' },
      { name: 'Strawberry', emoji: '🍓' },
      { name: 'Cherry', emoji: '🍒' },
      { name: 'Peach', emoji: '🍑' },
      { name: 'Pear', emoji: '🍐' },
      { name: 'Lemon', emoji: '🍋' },
      { name: 'Coconut', emoji: '🥥' },
      { name: 'Kiwi', emoji: '🥝' }
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
      { name: 'Onion', emoji: '🧅' },
      { name: 'Corn', emoji: '🌽' },
      { name: 'Cucumber', emoji: '🥒' },
      { name: 'Broccoli', emoji: '🥦' },
      { name: 'Garlic', emoji: '🧄' },
      { name: 'Chilli', emoji: '🌶️' },
      { name: 'Cabbage', emoji: '🥬' },
      { name: 'Mushroom', emoji: '🍄' }
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
      { name: 'Legs', emoji: '🦵' },
      { name: 'Mouth', emoji: '👄' },
      { name: 'Tongue', emoji: '👅' },
      { name: 'Teeth', emoji: '🦷' },
      { name: 'Arm', emoji: '💪' },
      { name: 'Foot', emoji: '🦶' },
      { name: 'Brain', emoji: '🧠' },
      { name: 'Heart', emoji: '❤️' },
      { name: 'Bone', emoji: '🦴' }
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
      { name: 'Bicycle', emoji: '🚲' },
      { name: 'Truck', emoji: '🚚' },
      { name: 'Ship', emoji: '🚢' },
      { name: 'Boat', emoji: '⛵' },
      { name: 'Helicopter', emoji: '🚁' },
      { name: 'Motorcycle', emoji: '🏍️' },
      { name: 'Tractor', emoji: '🚜' },
      { name: 'Ambulance', emoji: '🚑' },
      { name: 'Fire Engine', emoji: '🚒' },
      { name: 'Rocket', emoji: '🚀' }
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
      { name: 'February', emoji: '🌼' },
      { name: 'March', emoji: '🎨' },
      { name: 'April', emoji: '🌸' },
      { name: 'May', emoji: '☀️' },
      { name: 'June', emoji: '🌴' },
      { name: 'July', emoji: '🌧️' },
      { name: 'August', emoji: '🇮🇳' },
      { name: 'September', emoji: '📚' },
      { name: 'October', emoji: '🍁' },
      { name: 'November', emoji: '🪔' },
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
      { name: 'Spring', emoji: '🌸' },
      { name: 'Autumn', emoji: '🍂' }
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
      { name: 'Capital - New Delhi', emoji: '🏛️' },
      { name: 'National Fruit - Mango', emoji: '🥭' },
      { name: 'National Tree - Banyan', emoji: '🌳' },
      { name: 'National River - Ganga', emoji: '🌊' },
      { name: 'Currency - Rupee', emoji: '₹' },
      { name: 'Independence Day - 15 August', emoji: '🎆' },
      { name: 'Republic Day - 26 January', emoji: '🎊' },
      { name: 'Taj Mahal', emoji: '🕌' }
    ]
  }
]

// Every topic has a quiz now.
export const GK_QUIZ_TOPICS = new Set(GK_TOPICS.map((t) => t.id))

/** How many questions one quiz round has (a topic with fewer cards just uses all of them). */
export const GK_QUESTIONS_PER_QUIZ = 8

// Topics where the picture is a good clue ("What is this?") and topics where it is not.
const PICTURE_TOPICS = new Set(['animals', 'birds', 'fruits', 'vegetables', 'body', 'vehicles'])
const NAME_ONLY_TOPICS = new Set(['days', 'months', 'seasons'])

function shuffled<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** A fresh random set of questions every time, using all the cards of the topic. */
export function makeGkQuiz(topicId: string): QuizQuestion[] {
  const topic = GK_TOPICS.find((t) => t.id === topicId)
  if (!topic) return []

  const chosen = shuffled(topic.items).slice(0, GK_QUESTIONS_PER_QUIZ)
  return chosen.map((item, i) => {
    const distractors = shuffled(topic.items.filter((x) => x.name !== item.name)).slice(0, 2)
    const options = shuffled([item, ...distractors])

    // "What is this?" - the picture is in the question, the answers are words only.
    const askWhatIsThis = topicId === 'india' || (PICTURE_TOPICS.has(topicId) && i % 2 === 1)
    if (askWhatIsThis) {
      return {
        id: `${topicId}-${i}`,
        prompt: `${item.emoji}  What is this?`,
        options: options.map((o) => ({ id: o.name, label: o.name })),
        correctId: item.name
      }
    }

    // "Which one is the ...?" - the answers show a picture and a word.
    const the = NAME_ONLY_TOPICS.has(topicId) ? '' : 'the '
    return {
      id: `${topicId}-${i}`,
      prompt: `Which one is ${the}${item.name}?`,
      options: options.map((o) => ({ id: o.name, label: o.name, emoji: o.emoji })),
      correctId: item.name
    }
  })
}
