const rootData = JSON.parse(localStorage.getItem('llip-app'))
const words = rootData.words
const eng = words.english
const renderWordView = (eng, kor) => {
  return `
  <div class="wordView">
  <h3>${kor.root} - ${eng.root}</h3>
  <p>${kor.type} - ${eng.definition}</p>
  <hr>
  </div>
  `
}

const container = document.querySelector('.container')
container.innerHTML = Object.values(words.korean).reduce((acc, word) => {
  return acc + renderWordView(eng[word.link], word)
}, '')
