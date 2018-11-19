const updateWordList = (engWords) => {
  const filterValue = filterWordType.value.toLowerCase();
  console.log("filter value", filterValue);
  Object.entries(rootData.korean).forEach( ([key, word] ) => {
    const wElement = engWords[word.link];
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

