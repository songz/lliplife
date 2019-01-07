const container = document.querySelector('#root')
const rootData = JSON.parse(localStorage.getItem('llip-app') || '{}')
const lessonMap = rootData.lessons.korean

const selection = rootData.selection || {}

container.innerHTML = ''

function Lesson (lessonId, lesson) {
  const div = document.createElement('div')
  div.innerHTML = `
    <div style="display: flex;">
      <p style="width: 350px; font-weight: 800">${lesson.title}</p>
      <p style="width: 100%">${lesson.description}</p>
    </div>
  `
  div.innerHTML += `<button>Select</button><hr />`
  container.appendChild(div)

  div.querySelector('button').onclick = () => {
    selection.lessonId = lessonId
    rootData.selection = selection
    localStorage.setItem('llip-app', JSON.stringify(rootData))
    window.location = '/flashLesson.html'
  }
};

const lessonEntries = Object.entries(lessonMap).sort((a, b) => {
  return (b[1].lessonOrder || 0) - (a[1].lessonOrder || 0)
})
lessonEntries.forEach(([lessonId, lesson]) => new Lesson(lessonId, lesson))
