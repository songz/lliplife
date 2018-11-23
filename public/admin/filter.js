const updateWordList = (engWords) => {
  const filterValue = filterWordType.value.toLowerCase();
  Object.entries(rootData.english).forEach( ([key, word] ) => {
    const wElement = engWords[key];
    if(filterValue === 'all' || word.type.toLowerCase() === filterValue) {
      wElement.show();
    } else {
      wElement.hide();
    }
  });
};

const setUpFilter = (engWords) => {
  updateWordList(engWords);
  filterWordType.onchange = () => updateWordList(engWords);
};

