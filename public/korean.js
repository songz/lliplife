function Word(word, id) {
  const container = document.createElement('div');
  container.className = 'wordContainer';

  container.innerHTML = helpers.renderEntry(word);
  root.appendChild(container);
  this.koreanKey = '';

  container.querySelector('.koreanRootSave').onclick = () => {
    const kValue = container.querySelector('.koreanInput').value;
    if(!kValue) return;
    if(this.koreanKey) {
      firebase.database().ref(`/global/korean/${this.koreanKey}`).update({
        root: kValue
      });
      rootData.korean[this.koreanKey].root = kValue;
      return localStorage.setItem('korean', JSON.stringify(rootData));
    }
    helpers.addNewKoreanWord(kValue, id, helpers.getWordType());
  };

  container.querySelector('.saveButton').onclick = () => {
    // Update Word
    const type = wordType.value;
    const data = {
      type,
      root: container.querySelector('.rootInput').value,
      definition: container.querySelector('.defInput').value,
    };
    if (type === 'verb') {
      data.past = container.querySelector('.pastInput').value;
      data.presentContinuous = container.querySelector('.pcInput').value;
    }
    rootData.english[id] = {...rootData.english[id], ...data};
    firebase.database().ref(`/global/english/${id}`).update(data);
    return localStorage.setItem('korean', JSON.stringify(rootData));
  };

  this.setDisplay = (nval) => {
    const dstyle = (word.root.includes(nval) || word.definition.includes(nval)) ? 'block' : 'none';
    container.style.display = dstyle;
  };
  this.setupKorean = (kWord, kKey) => {
    this.koreanKey = kKey;
    container.querySelector('.koreanInput').value = kWord.root;
  };
};

const rootData = JSON.parse(localStorage.getItem('llip-app')).words;
if (rootData) {
  helpers.syncTmpWords(rootData);

  const engWords = {};
  Object.entries(rootData.english).forEach( ([key, word] ) => {
    word.definition = word.definition || '';
    if(!word.root) console.log('wtf', word);
    //if(word.type === 'verb') {
    engWords[key] = new Word(word, key);
    //}
  });

  Object.entries(rootData.korean).forEach( ([key, word] ) => {
    const wElement = engWords[word.link];
    if(!wElement) return;
    wElement.setupKorean(word, key);
  });

  const types = ['adjective', 'adverb', 'noun', 'verb'];
  console.log(rootData);

  wordType.onchange = () => {
    const displayStyle = (wordType.value === 'verb') ? 'inline-block' : 'none';
    Array.from(document.querySelectorAll('.verbSpecific')).forEach(e => {
      e.style.display = displayStyle;
    });
  }

  // Creating new words
  newWordEng.onclick = () => {
    // Adding new word
    const type = wordType.value;
    const data = {type, root: rootInput.value, definition: defInput.value};
    if (type === 'verb') {
      data.presentContinuous = pcInput.value;
      data.past = pastInput.value;
    }
    console.log(data);
    const link = firebase.database().ref('/global/english').push(data).key;
    //const link = `tmp22${Date.now()}`;
    rootData.english[link] = data;
    helpers.addNewKoreanWord(kInput.value, link, type);
  };

  rootInput.onkeyup = () => {
    const inVal = rootInput.value;
    Object.values(engWords).forEach( w => {
      w.setDisplay(inVal);
    });
  };
}
