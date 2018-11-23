const appData = JSON.parse(localStorage.getItem('llip-app'));
const rootData = JSON.parse(localStorage.getItem('llip-app')).words;
if (rootData) {
  helpers.syncTmpWords(rootData);

  const engWords = {};
  Object.entries(rootData.english).forEach( ([key, word] ) => {
    word.definition = word.definition || '';
    engWords[key] = new Word(word, key);
  });

  Object.entries(rootData.korean).forEach( ([key, word] ) => {
    const wElement = engWords[word.link];
    wElement.setupKorean(word, key);
  });

  setUpFilter(engWords);
  setUpNewWordComponent(engWords);
}

const saveDB = () => {
  appData.words = rootData;
  return localStorage.setItem('llip-app', JSON.stringify(appData));
};
