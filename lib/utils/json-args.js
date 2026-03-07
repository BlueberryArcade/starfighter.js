import escapeHtml from './escapeHtml';

function clean(regex) {
  return function (str) {
    if (!str) return '';
    if (!regex.test(str)) {
      let res = '';
      for (const c of str) {
        if (regex.test(c)) res += c;
        else res += '?';
      }
      return res;
    }
    return str;
  };
}

const cleanRegex = {
  alphanumeric: clean(/^[a-z0-9\-_]+$/i),
  identifier: clean(/^[a-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæð∂Þªß\-_+\s]+$/i),
  name: clean(/^[a-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæð∂Þªß,'_!+\-.?()@&\s]+$/i),
  path: clean(/^[a-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæð∂Þªß,'_!+\-.?()/@&\s]+$/i)
};

function validateDate(str, def) {
  const regex = new RegExp(
    `^${def.pattern.replace(/[a-z]+/gi, (match) => `\\d{${match.length}}`)}$`
  );
  if (!regex.test(str)) {
    throw new Error('Invalid date format');
  }
  return str;
}

function inSet(set, item) {
  for (const k in set) if (set[k] == item) return true;
  return false;
}

const stringFormat = {
  identifier: (str) => cleanRegex.identifier(str),
  text: (str) => escapeHtml(str),
  date: (str, def) => validateDate(str, def),
  regex: (str, def) => {
    if (!def.pattern.test(str)) {
      throw new Error('Invalid regex pattern');
    }
    return str;
  },
  name: (str) => cleanRegex.name(str),
  path: (str) => cleanRegex.path(str),
  alphanumeric: (str) => cleanRegex.alphanumeric(str),
  unsafe: (str) => str
};

const typeHandler = {
  integer: (value) => +value,
  number: (value) => +value,
  boolean: (value) => value == 'true' || value == '1',
  string: (value, def) => {
    let res = value;

    // Trim whitespace from string
    if (def.trim) {
      res = value.trim();
    }

    // Invalidate if a min length was not met
    if (def.minLength) {
      if (res.length < def.minLength) {
        throw new Error('Passed string did not meet length requirements');
      }
    }

    // Format string
    if (res && def.format && def.format in stringFormat) {
      const formatter = stringFormat[def.format];
      res = formatter(res, def);
    } else res = stringFormat.identifier(res, def);

    // Make sure numbers are strings
    if (!Number.isNaN(res)) res = `${res}`;

    // Validate set
    if (def.set && typeof def.set !== 'boolean' && !inSet(def.set, res))
      throw new Error(`"${res}" does not belong to expected set`);

    return res;
  },
  array: (value, def) => {
    const res = [];
    value.forEach((v) => {
      res.push(extractArgs({ item: def.items }, { item: v }).item);
    });
    return res;
  },
  object: (value, def) => {
    let res = [];
    if (def.properties) {
      res = extractArgs(def.properties, value);
    } else if (def.format == 'any') res = value;
    else throw new Error('Object requires properties or format "any"');
    return res;
  }
};

function extractArgs(expects, args) {
  const res = {};
  Object.entries(args).forEach(([name, value]) => {
    // try {
    const def = expects[name];
    if (def) {
      const handler = typeHandler[def.type];
      if (handler) {
        res[name] = handler(value, def);
      }
    }
    /* } catch (e) {
			throw new Error(`${e} for field ${name}`);
		}*/
  });
  return res;
}

function validate(expects, args) {
  return extractArgs(expects, args);
}

export { validate };
