import { runtime } from '..';

const splitLines = value => {
  const regex = /\n/g;
  let pos = 0;
  let match;
  const lines = [];
  while ((match = regex.exec(value))) {
    lines.push(value.substring(pos, match.index + 1));
    pos = match.index + 1;
  }

  if (pos < value.length) {
    lines.push(value.substring(pos, value.length));
  }
  return lines;
};

const wordWrap = (value, arg) => {
  const wrap = [];
  const width = parseInt(arg);
  splitLines(value.toString()).forEach(line => {
    let maxWidth = Math.max(line.endsWith('\n') ? width + 1 : width, width);

    while (line.length > maxWidth) {
      let space = line.substring(0, maxWidth + 1).lastIndexOf(' ') + 1;

      if (space === 0) {
        space = line.indexOf(' ') + 1;

        if (space === 0) {
          wrap.push(line);
          line = '';
          break;
        }
      }

      wrap.push(`${line.substring(0, space - 1)}\n`);
      line = line.substring(space, space.length);
      maxWidth = Math.max(line.endsWith('\n') ? width + 1 : width, width);
    }

    if (line) {
      wrap.push(line);
    }
  });

  return runtime.copySafeness(value, wrap.join(''));
};

export default wordWrap;
