const hiddenWord = 'absolutely'; // set word here
let words = [];

fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words.txt')
  .then(response => response.text())
  .then((data) => {
    words = data.split('\n').map(word => word.toLowerCase());
    const foundWord = findWord(hiddenWord.length);
    console.log('***');
    console.log('Hidden word: ', foundWord);
    console.log('***');
  }, (error) => {
    console.log('Dictionary has not loaded. It is impossible to run the game.');
    console.log(error);
  });

function findWord(length) {
  let regExpStr = '';
  let usedChars = [];
  // chars by frequency
  const alphabet = ['e', 't', 'a', 'o', 'i', 'n', 's', 'h', 'r', 'd', 'l', 'c', 'u', 'm', 'w', 'f', 'g', 'y', 'p', 'b', 'v', 'k', 'j', 'x', 'q', 'z'];
  let unusedChars = [...alphabet];
  let foundWords = [];

  for (let i = 0; i < length; i += 1) {
    regExpStr += '.';
  }
  console.log(regExpStr);

  const filterWords = (char) => {
    const hiddenChars = checkHiddenChar(char);
    if (!hiddenChars.length) {
      return foundWords;
    }

    hiddenChars.forEach((hiddenChar) => {
      regExpStr = setCharAt(regExpStr, hiddenChar.i, hiddenChar.char);
    });
    console.log(regExpStr);
    const regExp = new RegExp(`^${regExpStr}$`, 'i');
    return words.filter(word => regExp.test(word));
  }

  usedChars.push(unusedChars[0]);
  foundWords = filterWords(unusedChars[0]);
  while (foundWords.length !== 1) {
    if (foundWords.length !== 0) {
      unusedChars = uniq(foundWords.join('').split(''))
        .filter(char => alphabet.includes(char))
        .filter(char => !usedChars.includes(char));
    } else {
      unusedChars = unusedChars.filter(char => !usedChars.includes(char));
    }

    if (!unusedChars.length) {
      foundWords = [];
      break;
    }

    usedChars.push(unusedChars[0]);
    foundWords = filterWords(unusedChars[0]);
  }

  const allegedHiddenWord = foundWords[0];
  if (!allegedHiddenWord) {
    return null;
  }

  const isHiddenWord = allegedHiddenWord.split('').every(char => checkHiddenChar(char).length);
  return isHiddenWord ? allegedHiddenWord : null;
}

function checkHiddenChar(char) {
  let hiddenChars = [];
  for (let i = 0; i < hiddenWord.length; i += 1) {
    if (hiddenWord[i] === char) {
      hiddenChars.push({ char, i });
    }
  }
  return hiddenChars;
}

function setCharAt(str, idx, char) {
  const chips = str.split('');
  chips[idx] = char;
  return chips.join('');
}

function uniq(arr) {
  let uniqArr = [];
  for (let str of arr) {
    if (!uniqArr.includes(str)) {
      uniqArr.push(str);
    }
  }
  return uniqArr;
}
