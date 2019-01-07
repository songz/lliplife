const helpers = {};

(function () {
  helpers.getWordType = () => {
    return document.querySelector('#wordType').value
  }

  helpers.renderEntry = (word) => {
    const defaultSelect = (sysType, wordType) => {
      return sysType === wordType ? 'selected="selected"' : ''
    }
    return `
    <div class="entryContainer2">
      <span class="bold">Korean</span>: <input type="text" class="koreanInput"></input>
      <button class="koreanRootSave">Save</button>
      <button class="koreanRootDelete">Delete</button>
    </div>
    <div class="entryContainer">
      <span class="bold">Type</span>: 
      <select class="wordType">
        <option value="adjective" ${defaultSelect('adjective', word.type)}>adjective</option>
        <option value="adverb" ${defaultSelect('adverb', word.type)}>adverb</option>
        <option value="noun" ${defaultSelect('noun', word.type)}>noun</option>
        <option value="verb" ${defaultSelect('verb', word.type)}>verb</option>
      </select>
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
    <button class="deleteButton">Delete</button>
    `
  }

  helpers.syncTmpWords = (data) => {
    // Make sure tmp words are saved in the direct format that db would expect
    // Save Root Words

    let tmpExist = false
    const map = Object.entries(data.english).reduce((acc, [key, word]) => {
      if (key.includes('tmp')) {
        tmpExist = true
        const link = fbdb.ref('/global/english').push(word).key
        data.english[link] = word
        delete data.english[key]
        acc[key] = link
      }
      return acc
    }, {})

    // Update linked words and
    Object.entries(data).forEach(([lang, words]) => {
      if (lang.includes('english')) return
      Object.entries(words).forEach(([key, word]) => {
        if (map[word.link]) word.link = map[word.link]
        if (key.includes('tmp')) {
          tmpExist = true
          const link = fbdb.ref(`/global/${lang}`).push(word).key
          words[link] = word
          delete words[key]
        } else if (word.edited) {
          delete word.edited
          console.log('Cannot sync edited words')
          // Handle Edit
        }
      })
    })

    if (tmpExist) {
      localStorage.setItem('korean', JSON.stringify(data))
      console.log('TMP changes found, updated localStorage and Firebase')
    }
  }

  helpers.addNewKoreanWord = (root, link, type) => {
    const kData = {
      type, root, link
    }
    const klink = firebase.database().ref('/global/korean').push(kData).key
    // const klink = `tmp23${Date.now()}`;
    rootData.korean[klink] = kData
    saveDB()
  }
})()

const fbdb = firebase.database()
