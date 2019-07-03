import normalize from 'normalize-strings';

const wordRegex = /<.*?>|((?:\w[-\w]*|&.*?;)+)/g;
const charRegex = /<.*?>|(.)/g;
const tagRegex = /<(\/)?(\S+?)(?:(\s*\/)|\s.*?)?>/;

class Truncator {
  constructor(text) {
    this.text = text;
  }

  addTruncationText(text, truncate = null) {
    if (truncate === null) {
      return `${text}...`;
    }

    if (text.endsWith(truncate)) {
      return text;
    }

    return `${text}${truncate}`;
  }

  chars(num, html = false, truncate = null) {
    const length = parseInt(num, 10);
    const text = this.text;
    let truncateLen = length;
    for (let char in this.addTruncationText('', truncate).split('')) {
      truncateLen -= 1;
      if (truncateLen === 0) {
        break;
      }
    }
    if (html) {
      return this.truncateHtml(length, truncate, text, truncateLen, false);
    }
    return this.textChars(length, truncate, text, truncateLen);
  }

  words(num, truncate = null, html = false) {
    const length = parseInt(num, 10);

    if (html) {
      return this.truncateHtml(length, truncate, this.text, length, true);
    }

    return this.textWords(length, truncate);
  }

  textChars(length, truncate, text, truncateLen) {
    let sLen = 0;
    let endIndex = null;

    for (let i in text.split('')) {
      sLen += 1;
      if (endIndex === null && sLen > truncateLen) {
        endIndex = i;
      }
      if (sLen > length) {
        return this.addTruncationText(text.slice(0, endIndex), truncate);
      }
    }

    return text;
  }

  textWords(length, truncate) {
    let words = this.text.split(' ');

    if (words.length > length) {
      words = words.slice(0, length);
      return this.addTruncationText(words.join(' '), truncate);
    }

    return words.join(' ');
  }

  truncateHtml(length, truncate, text, truncateLen, words) {
    if (words && length <= 0) {
      return '';
    }

    const htmlSinglets = [
      'br',
      'col',
      'link',
      'base',
      'img',
      'param',
      'area',
      'hr',
      'input'
    ];

    let endTextPos = 0;
    let currentLen = 0;
    let openTags = [];

    const regex = words ? wordRegex : charRegex;
    // Reset global regex
    regex.lastIndex = 0;
    while (currentLen <= length) {
      const m = regex.exec(normalize(text));
      if (!m) {
        break;
      }
      // If group match collect character/word
      if (m[1]) {
        currentLen += 1;
        if (currentLen === truncateLen) {
          endTextPos = m.index + m[1].length;
        }
        continue;
      }

      // Check if match is actually a tag
      const tag = tagRegex.exec(m[0]);
      if (!tag || currentLen >= truncateLen) {
        continue;
      }

      const closingTag = tag[1];
      const tagname = tag[2].toLowerCase();
      const selfClosing = tag[3];

      if (selfClosing || htmlSinglets.includes(tagname)) {
        // pass
      } else if (closingTag) {
        const i = openTags.indexOf(tagname);
        openTags = openTags.slice(i + 1, openTags.length);
      } else {
        openTags.unshift(tagname);
      }
    }

    if (currentLen <= length) {
      return text;
    }

    let out = text.slice(0, endTextPos);
    let truncate_text = this.addTruncationText('', truncate);
    if (truncate_text) {
      out += truncate_text;
    }

    for (let tag in openTags) {
      out += `</${openTags[tag]}>`;
    }

    return out;
  }
}

export default Truncator;
