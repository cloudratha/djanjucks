import { runtime } from '..';
import { escapeHtml } from '../utilities';

// Nunjucks' join filter doesn't implement safe strings.
// But this guy does.
const join = function(value, arg) {
  const { autoescape } = this.env.opts;

  if (autoescape) {
    value = value.map(item => {
      return item instanceof runtime.SafeString ? item : escapeHtml(item);
    });
  }

  const delimeter = arg instanceof runtime.SafeString ? arg : escapeHtml(arg);

  return runtime.markSafe(value.join(delimeter));
};

export default join;
