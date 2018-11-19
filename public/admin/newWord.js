const setUpNewWordComponent = (engWords) => {
  // Setting up new word
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
    console.log('word to be added', data);
    const link = firebase.database().ref('/global/english').push(data).key;
    //const link = `tmp22${Date.now()}`;
    rootData.english[link] = data;
    helpers.addNewKoreanWord(kInput.value, link, type);
  };

  rootInput.onkeyup = () => {
    const inVal = rootInput.value;
    Object.values(engWords).forEach( w => {
      w.filterWord(inVal);
    });
  };
};
