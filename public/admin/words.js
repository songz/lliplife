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
      return saveDB();
    }
    helpers.addNewKoreanWord(kValue, id, helpers.getWordType());
  };

  container.querySelector('.saveButton').onclick = () => {
    // Update Word
    const type = container.querySelector('.wordType').value;
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
    return saveDB();
  };

  this.filterWord = (nval) => {
    const dstyle = (word.root.includes(nval) || word.definition.includes(nval)) ? 'block' : 'none';
    container.style.display = dstyle;
  };
  this.show = () => {
    container.style.display = 'block';
  };
  this.hide = () => {
    container.style.display = 'none';
  };
  this.setupKorean = (kWord, kKey) => {
    this.koreanKey = kKey;
    container.querySelector('.koreanInput').value = kWord.root;
  };
};

