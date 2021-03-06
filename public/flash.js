const eFront = document.querySelector('#content h1')
const eExtra = document.querySelector('#content .extra')
const eContent = document.querySelector('#content')
const eControls = document.querySelector('#controls')
const eProgress = document.querySelector('.progress')
const eFeedbackButtons = Array.from(document.querySelectorAll('#controls .control'))

const progression = new Set()

eFeedbackButtons.forEach(element => {
  element.onclick = (e) => {
    e.stopPropagation()
    const val = element.dataset.value
    if (val === 'bad') {
      cards.splice(1, 0, currentWordId)
      cardStats[currentWordId] = 1
      rootData.cardStats = cardStats
    }
    if (val === 'good') {
      progression.add(currentWordId)
      eProgress.innerText = progression.size
      let stat = +cardStats[currentWordId]
      if (stat) {
        stat *= 2
        if (stat >= cards.length) {
          alert('word is cleared: ' + currentWordId)
          delete cardStats[currentWordId]
          cards.push(currentWordId)
        } else {
          cardStats[currentWordId] = stat
          cards.splice(stat, 0, currentWordId)
        }
        rootData.cardStats = cardStats
      } else {
        cards.push(currentWordId)
      }
    }
    rootData.cardsContent = cards
    localStorage.setItem('llip-app', JSON.stringify(rootData))
    startCard()
  }
})

let flipped = false
eContent.onclick = () => {
  if (flipped) {
    flipped = false
    eControls.classList.add('hidden')
    showContent()
    return
  };
  flipCard()
}

const flipCard = () => {
  flipped = true
  eControls.classList.remove('hidden')
  showContent()
}

feedBack.onclick = (e) => {
}

const lang = 'korean'
if (!localStorage.getItem('llip-app') || localStorage.getItem('llip-app').length < 100) {
  loadAppData()
}
const rootData = JSON.parse(localStorage.getItem('llip-app'))
if (!rootData || !rootData.words || !rootData.words.english) {
  loadAppData()
}
const words = rootData.words
const engWords = words.english
const langWords = words[lang]
const cardStats = rootData.cardStats || {}

const cards = rootData.cardsContent || Object.keys(langWords)
// const cards = Object.keys(langWords);
console.log(cards.length)

let currentContent = []
let currentWordId = ''

const showContent = () => {
  const word = flipped ? currentContent[1] : currentContent[0]
  console.log(word)
  eFront.innerText = (word.display || word.root)
  eExtra.innerText = word.definition || ''
}

const startCard = () => {
  flipped = false
  currentWordId = cards.shift()
  const word = langWords[currentWordId]
  const engWord = engWords[word.link]
  if (engWord.type === 'verb') { engWord.display = `to ${engWord.root}` }
  if (engWord.type === 'adjective') { engWord.display = `to be ${engWord.root}` }
  engWord.isEnglish = true
  currentContent = [engWord, word]
  eControls.classList.add('hidden')
  showContent()
}

startCard()
console.log(cards)

document.querySelector('#speaker').onclick = () => {
  const word = flipped ? currentContent[1] : currentContent[0]
  const voice = word.isEnglish ? 'US English Female' : 'Korean Female'
  responsiveVoice.speak(word.root, voice, { rate: 0.7 })
}
