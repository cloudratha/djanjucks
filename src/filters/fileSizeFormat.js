import { avoidWrapping } from '../utilities';

// Django's filter stops at PB so we need to work out the format manually
const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;
const TB = GB * 1024;
const PB = TB * 1024;

const fileSizeFormat = value => {
  let bytes = parseFloat(value);

  if (isNaN(bytes)) {
    return avoidWrapping('0 bytes');
  }

  const sign = Math.sign(bytes);
  bytes = Math.abs(bytes);
  let output = '';

  if (bytes < KB) {
    output = `${bytes} bytes`;
  } else if (bytes < MB) {
    output = `${(bytes / KB).toFixed(1)} KB`;
  } else if (bytes < GB) {
    output = `${(bytes / MB).toFixed(1)} MB`;
  } else if (bytes < TB) {
    output = `${(bytes / GB).toFixed(1)} GB`;
  } else if (bytes < PB) {
    output = `${(bytes / TB).toFixed(1)} TB`;
  } else {
    output = `${(bytes / PB).toFixed(1)} PB`;
  }

  if (sign === -1) {
    output = `-${output}`;
  }

  return avoidWrapping(output);
};

export default fileSizeFormat;
