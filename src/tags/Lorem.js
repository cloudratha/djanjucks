import { runtime } from '..';
import Tag from './Tag';

const COMMON_P = [
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod ',
  'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ',
  'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ',
  'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate ',
  'velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint ',
  'occaecat cupidatat non proident, sunt in culpa qui officia deserunt ',
  'mollit anim id est laborum.'
];

const WORDS = [
  'exercitationem',
  'perferendis',
  'perspiciatis',
  'laborum',
  'eveniet',
  'sunt',
  'iure',
  'nam',
  'nobis',
  'eum',
  'cum',
  'officiis',
  'excepturi',
  'odio',
  'consectetur',
  'quasi',
  'aut',
  'quisquam',
  'vel',
  'eligendi',
  'itaque',
  'non',
  'odit',
  'tempore',
  'quaerat',
  'dignissimos',
  'facilis',
  'neque',
  'nihil',
  'expedita',
  'vitae',
  'vero',
  'ipsum',
  'nisi',
  'animi',
  'cumque',
  'pariatur',
  'velit',
  'modi',
  'natus',
  'iusto',
  'eaque',
  'sequi',
  'illo',
  'sed',
  'ex',
  'et',
  'voluptatibus',
  'tempora',
  'veritatis',
  'ratione',
  'assumenda',
  'incidunt',
  'nostrum',
  'placeat',
  'aliquid',
  'fuga',
  'provident',
  'praesentium',
  'rem',
  'necessitatibus',
  'suscipit',
  'adipisci',
  'quidem',
  'possimus',
  'voluptas',
  'debitis',
  'sint',
  'accusantium',
  'unde',
  'sapiente',
  'voluptate',
  'qui',
  'aspernatur',
  'laudantium',
  'soluta',
  'amet',
  'quo',
  'aliquam',
  'saepe',
  'culpa',
  'libero',
  'ipsa',
  'dicta',
  'reiciendis',
  'nesciunt',
  'doloribus',
  'autem',
  'impedit',
  'minima',
  'maiores',
  'repudiandae',
  'ipsam',
  'obcaecati',
  'ullam',
  'enim',
  'totam',
  'delectus',
  'ducimus',
  'quis',
  'voluptates',
  'dolores',
  'molestiae',
  'harum',
  'dolorem',
  'quia',
  'voluptatem',
  'molestias',
  'magni',
  'distinctio',
  'omnis',
  'illum',
  'dolorum',
  'voluptatum',
  'ea',
  'quas',
  'quam',
  'corporis',
  'quae',
  'blanditiis',
  'atque',
  'deserunt',
  'laboriosam',
  'earum',
  'consequuntur',
  'hic',
  'cupiditate',
  'quibusdam',
  'accusamus',
  'ut',
  'rerum',
  'error',
  'minus',
  'eius',
  'ab',
  'ad',
  'nemo',
  'fugit',
  'officia',
  'at',
  'in',
  'id',
  'quos',
  'reprehenderit',
  'numquam',
  'iste',
  'fugiat',
  'sit',
  'inventore',
  'beatae',
  'repellendus',
  'magnam',
  'recusandae',
  'quod',
  'explicabo',
  'doloremque',
  'aperiam',
  'consequatur',
  'asperiores',
  'commodi',
  'optio',
  'dolor',
  'labore',
  'temporibus',
  'repellat',
  'veniam',
  'architecto',
  'est',
  'esse',
  'mollitia',
  'nulla',
  'a',
  'similique',
  'eos',
  'alias',
  'dolore',
  'tenetur',
  'deleniti',
  'porro',
  'facere',
  'maxime',
  'corrupti'
];

const COMMON_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipisicing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua'
];

const words = (count, common = true) => {
  let wordList = common ? COMMON_WORDS : [];
  let c = wordList.length;
  if (count > c) {
    for (let i = 0; i < count; i += 1) {
      wordList.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
  } else {
    wordList = wordList.slice(0, count);
  }

  return wordList.join(' ');
};

const sentence = () => {
  const random = Math.floor(Math.random() * 5) + 1;
  const sentence = [];
  for (let i = 0; i < random; i += 1) {
    const words = Math.floor(Math.random() * 12) + 3;
    const start = Math.min(
      Math.floor(Math.random() * WORDS.length),
      WORDS.length - words
    );

    sentence.push(WORDS.slice(start, start + words).join(' '));
  }
  const s = sentence.join(', ');
  return `${s[0].toUpperCase()}${s.substr(1)}${
    Math.random() < 0.5 ? '?' : '.'
  }`;
};

const paragraph = () => {
  const random = Math.floor(Math.random() * 4) + 1;
  const paragraph = [];
  for (let i = 0; i < random; i += 1) {
    paragraph.push(sentence());
  }

  return paragraph.join(' ');
};

const paragraphs = (count, common = true) => {
  const paras = [];

  for (let i = 0; i < count; i += 1) {
    if (common && i === 0) {
      paras.push(COMMON_P[0]);
    } else {
      paras.push(paragraph());
    }
  }

  return paras;
};

class LoremTag extends Tag {
  constructor() {
    super();
    this.tags = ['lorem'];
  }

  run(context, count, method, random) {
    const common = random ? random !== 'random' : true;
    if (!['w', 'p', 'b'].includes(method)) {
      method = 'b';
    }

    if (!count) {
      count = 1;
    }

    if (method === 'w') {
      return words(count, common);
    }

    return new runtime.SafeString(
      paragraphs(count, common)
        .map(para => `<p>${para}</p>`)
        .join('\n')
    );
  }
}

export default LoremTag;
