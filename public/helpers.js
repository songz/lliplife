const helpers = {};

(function() {
  helpers.getWordType = () => {
    return document.querySelector('#wordType').value;
  };

  helpers.renderEntry = (word) => {
    return `
    <div class="entryContainer2">
      <span class="bold">Korean</span>: <input type="text" class="koreanInput"></input>
      <button class="koreanRootSave">Save</button>
    </div>
    <div class="entryContainer">
      <span class="bold">Root</span>: <input type="text" value="${word.root}" class="rootInput"></input>
    </div>
    <div class="entryContainer">
      <span class="bold">Past</span>: <input type="text" value="${word.past || ''}" class="pastInput"></input>
    </div>
    <div class="entryContainer">
      <span class="bold">Present Continuous</span>: <input type="text" value="${word.presentContinuous || ''}" class="pcInput"></input>
    </div>
    <br>
    <textarea class="defInput">${word.definition}</textarea>
    <br>
    <button class="saveButton">Save</button>
    `;
  };

  helpers.syncTmpWords = (data) => {
    // Make sure tmp words are saved in the direct format that db would expect
    // Save Root Words

    let tmpExist = false;
    const map = Object.entries(data.english).reduce( (acc, [key, word]) => {
      if(key.includes('tmp')) {
        tmpExist = true;
        const link = fbdb.ref('/global/english').push(word).key;
        data.english[link] = word;
        delete data.english[key];
        acc[key] = link;
      }
      return acc;
    }, {});

    // Update linked words and
    Object.entries(data).forEach( ([lang, words]) => {
      if (lang.includes('english')) return;
      Object.entries(words).forEach( ([key, word]) => {
        if (map[word.link]) word.link = map[word.link];
        if(key.includes('tmp')) {
          tmpExist = true;
          console.log('syncing key', word);
          return;
          const link = fbdb.ref(`/global/${lang}`).push(word).key;
          words[link] = word;
          delete words[key];
        } else if(word.edited) {
          delete word.edited
          console.log('Cannot sync edited words');
          // Handle Edit
        }
      });
    });

    if (tmpExist) {
      localStorage.setItem('korean', JSON.stringify(data));
      console.log('TMP changes found, updated localStorage and Firebase');
    }
  };

  helpers.addNewKoreanWord = (root, link, type) => {
    const kData = {
      type, root, link
    }
    const klink = firebase.database().ref('/global/korean').push(kData).key;
    //const klink = `tmp23${Date.now()}`;
    rootData.korean[klink] = kData;
    localStorage.setItem('korean', JSON.stringify(rootData));
  };
})();

/*
const fbdb = {
  ref: (url) => {
    return {
      push: (data) => {
        return {key: `tmp${Date.now() + Math.random()}b`}
      }
    }
  }
}
*/
const fbdb = firebase.database();
