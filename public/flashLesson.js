Array.prototype.random = function() {
  const id = Math.floor(Math.random() * this.length);
  return [id, this[id]];
};

(function () {

  const eFront = document.querySelector('#content h1');
  const eExtra = document.querySelector('#content .extra');
  const eContent = document.querySelector('#content');
  const eControls = document.querySelector('#controls');
  const eProgress = document.querySelector('.progress');
  const eFeedbackButtons = Array.from(document.querySelectorAll('#controls .control'));

  const progression = new Set();
  const kClient = new Korean();
  const lang = 'korean';

  /**
   * User Variables
   */
  let flipped = false;
  let currentContent = [];
  let wordMap = {};

  /**
   * App Setup
   */
  if (!localStorage.getItem('llip-app') || localStorage.getItem('llip-app').length < 100) {
    loadAppData();
    return;
  }
  const rootData = JSON.parse(localStorage.getItem('llip-app'));
  if (!rootData || !rootData.words || !rootData.words.english) {
    console.log('loading appp data');
    loadAppData();
    return;
  }

  const engWords = rootData.words.english;
  const langWords = rootData.words[lang];
  const cardStats = rootData.cardStats || {};

  const selection = rootData.selection || {}; // TODO: default lessonId
  const selectedLesson = (rootData.lessons.korean[selection.lessonId] || {});

  const cards = rootData.cardsContent || Object.keys(langWords);

  setTimeout(() => {
    startCard()
  }, 0);

  /**
   * Helper functions
   */
  const skipWordByTense = (stat, tense, i=0) => {
    if (i === cards.length) return -1;
    if (!stat) return i;
    const nextStat = tense === langWords[cards[i]].type ? stat - 1 : stat;
    return skipWordByTense(nextStat, tense, i + 1);
  };
  const flipCard = () => {
    flipped = true;
    eControls.classList.remove('hidden');
    showContent();
  };
  const showContent = () => {
    const word = flipped ? currentContent[1] : currentContent[0];
    eFront.innerText = (word.display || word.root);
    eExtra.innerText = word.definition || '';
  };
  const getNextWord = (type, except=[], i=0) => {
    const wordId = cards[i];
    const word = langWords[wordId];
    if (word.type === type && !except.includes(wordId)) {
      return cards.splice(i, 1)[0];
    }
    return getNextWord(type, except, i+1);
  };
  const startCard = () => {
    flipped = false;
    const engStruct = selectedLesson.englishStructure;
    const langStruct = selectedLesson.languageStructure;

    let engDisplay = "";
    let langDisplay = "";
    let engRoot = '';

    if (!engStruct || !langStruct) {
      const wordId = cards.shift();
      wordMap = { blahblah: {wordId} }
      langDisplay = langWords[wordId].root;
      const engWord = engWords[langWords[wordId].link];
      if (engWord.type === 'verb') {
        engDisplay = `to ${engWord.root}`;
        engRoot = engWord.root;
      }
      if (engWord.type === 'adjective') {
        engDisplay = `to be ${engWord.root}`;
        engRoot = engWord.root;
      }
    } else {
      wordMap = engStruct.split('-').reduce((acc, e, i) => {
        const regex = /^(\d*)(.*)\((.*)\)/g;
        const [_, num, type, tense] = regex.exec(e);
        const key = num + type;
        const mapVal = {}
        if (type === 'custom') {
          const [customId, value] = tense.split('|').random();
          mapVal.customId = customId;
          engDisplay += `${value} `;
        } else {
          const existingWordIds = Object.values(acc).reduce( (a, e) => {
            if (e.wordId) {
              a.push(e.wordId);
              return a;
            }
            return a;
          }, []);
          mapVal.wordId = getNextWord(type, existingWordIds);
          engDisplay += `${engWords[langWords[ mapVal.wordId ].link][tense]} `;
        }
        acc[key] = mapVal;
        return acc;
      }, {});

      langStruct.split('-').forEach((e, i) => {
        const regex = /^(\d*)(.*)\((.*)\)/g;
        const [_, num, type, tense] = regex.exec(e);
        const key = num + type;
        const mapVal = wordMap[key];
        if (type === 'custom') {
          const options = tense.split('|');
          langDisplay += mapVal ? `${options[mapVal.customId]} ` : `${options.random()[1]}`
        } else {
          langDisplay += `${kClient.conjugate(langWords[mapVal.wordId].root, {tense})} `;
        }
      });
    }

    currentContent = [{
      display: engDisplay,
      isEnglish: true,
      root: engRoot || false
    }, {
      display: langDisplay
    }];
    eControls.classList.add('hidden');
    showContent();
  };

  /**
   * User Interaction Setup
   */
  eFeedbackButtons.forEach(element => {
    element.onclick = (e) => {
      e.stopPropagation();
      const val = element.dataset.value;
      const words = Object.values(wordMap).filter( w => w.wordId ).map( w => w.wordId )
      words.forEach( (wordId, i) => {
        if (val === "bad") {
          // Skipping so the same combination doesn't show up again
          const nextId = skipWordByTense(i, langWords[wordId].type);
          if (nextId < 0) {
            cards.push(wordId);
          } else {
            cardStats[wordId] = 1;
            cards.splice(nextId, 0, wordId);
          }
        }
        if (val === "good") {
          progression.add(wordId);
          let stat = +cardStats[wordId];
          if (stat) {
            stat *= 2;
            const nextId = skipWordByTense(stat, langWords[wordId].type);
            if(nextId < 0) {
              alert('word is cleared: ' + wordId);
              delete cardStats[wordId];
              cards.push(wordId);
            } else {
              cardStats[wordId] = stat;
              cards.splice(nextId, 0, wordId);
            }
          } else {
            cards.push(wordId);
          }
          rootData.cardStats = cardStats;
        }
      });
      eProgress.innerText = progression.size;
      rootData.cardsContent = cards;
      localStorage.setItem('llip-app', JSON.stringify(rootData));
      startCard();
    };
  });

  eContent.onclick = () => {
    if (flipped) {
      flipped = false;
      eControls.classList.add('hidden');
      showContent();
      return;
    };
    flipCard();
  };

  document.querySelector('#speaker').onclick = () => {
    const word = flipped ? currentContent[1] : currentContent[0];
    const voice = word.isEnglish ? "US English Female" : 'Korean Female';
    responsiveVoice.speak(word.root || word.display, voice, {rate: 0.7});
  };

})();
