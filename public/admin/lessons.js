const container = document.querySelector('#root');

const createInputTemplate = (key, val) => {
  if (key === 'content') return `
    <textarea id="${key}" class="inputField">${val}</textarea>
  `;
  return `<input id="${key}" class="inputField" type="text" value=${val}>`
};

function Lesson(lessonId, lesson) {
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="display: flex;">
      <label for="${lessonId}title" style="width: 200px;">Title</label>
      <input id="${lessonId}title" class="inputField" type="text" value=${lesson.title || ''}>
    </div>
    <div class="hidden">
      <label for="${lessonId}id" style="width: 200px;">Id</label>
      <input id="${lessonId}id" class="inputField" type="text" value=${lesson.id || lessonId}>
    </div>
    <div style="display: flex;">
      <label for="${lessonId}cardContent" style="width: 200px;">Card Content</label>
      <input id="${lessonId}cardContent" class="inputField" type="text" value=${lesson.cardContent || ''}>
    </div>
    <div style="display: flex;">
      <label for="${lessonId}content" style="width: 200px;">Content</label>
      <textarea id="${lessonId}content" class="inputField" >${lesson.content || ''}</textarea>
    </div>
    <div class="hidden">
      <label for="${lessonId}dateCreated" style="width: 200px;">Date Created</label>
      <input id="${lessonId}dateCreated" class="inputField" type="text" value=${lesson.dateCreated || ''}>
    </div>
    <div style="display: flex;">
      <label for="${lessonId}description" style="width: 200px;">Description</label>
      <input id="${lessonId}description" class="inputField" type="text" value=${lesson.description || ''}>
    </div>
    <div style="display: flex;">
      <label for="${lessonId}englishStructure" style="width: 200px;">English Struct</label>
      <input id="${lessonId}englishStructure" class="inputField" type="text" value=${lesson.englishStructure || ''}>
    </div>
    <div style="display: flex;">
      <label for="${lessonId}languageStructure" style="width: 200px;">Language Struct</label>
      <input id="${lessonId}languageStructure" class="inputField" type="text" value=${lesson.languageStructure || ''}>
    </div>
    <div style="display: flex;">
      <label for="${lessonId}hint" style="width: 200px;">Hint</label>
      <input id="${lessonId}hint" class="inputField" type="text" value=${lesson.hint || ''}>
    </div>
    <div style="display: flex;">
      <label for="${lessonId}lessonOrder" style="width: 200px;">Lesson Order</label>
      <input id="${lessonId}lessonOrder" class="inputField" type="text" value=${lesson.lessonOrder || ''}>
    </div>
    <div style="display: flex;">
      <label for="${lessonId}video" style="width: 200px;">Video</label>
      <input id="${lessonId}video" class="inputField" type="text" value=${lesson.video || ''}>
    </div>
  `;
  div.innerHTML += `<button>submit</button><hr />`;
  container.appendChild(div);

  div.querySelector('button').onclick = () => {
    const lessonData = {};
    const inputs = div.querySelectorAll('.inputField');
    inputs.forEach( inp => {
      const key = inp.id.replace(lessonId,'');
      lessonData[key] = inp.value;
    });
    if (lessonId === 'new') {
      lessonId = firebase.database().ref('/lessons/korean').push({}).key;
    }
    lessonData.id = lessonId;
    firebase.database().ref(`/lessons/korean/${lessonId}`).update(lessonData);
  };
};

const startApp = () => {
  const rootData = JSON.parse(localStorage.getItem('llip-app') || "{}");
  const lessonMap = rootData.lessons.korean;
  container.innerHTML = '';

  new Lesson('new', {});
  const lessonEntries = Object.entries(lessonMap).sort( (a, b) => {
    return (b[1].lessonOrder || 0) - (a[1].lessonOrder || 0)
  });
  lessonEntries.forEach( ([lessonId, lesson]) => new Lesson(lessonId, lesson) );
};

