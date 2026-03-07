/* eslint-disable no-undef */
import { validate } from './json-args.js';

function check(def) {
  const args = validate(def.expects, def.input);
  expect(args).toEqual(def.output);
}

function error(def) {
  expect(() => {
    validate(def.expects, def.input);
  }).toThrow();
}

describe('basic type validation', () => {
  it('should convert an integer', () => {
    check({
      expects: {
        int: { type: 'integer' }
      },
      input: {
        int: '5'
      },
      output: {
        int: 5
      }
    });
  });

  it('should convert a number', () => {
    check({
      expects: {
        num: { type: 'number' }
      },
      input: {
        num: '5.2'
      },
      output: {
        num: 5.2
      }
    });
  });

  it('should convert booleans', () => {
    check({
      expects: {
        tString: { type: 'boolean' },
        fString: { type: 'boolean' },
        fBool: { type: 'boolean' },
        tBool: { type: 'boolean' }
      },
      input: {
        tString: 'true',
        fString: 'false',
        tBool: true,
        fBool: false
      },
      output: {
        tString: true,
        fString: false,
        tBool: true,
        fBool: false
      }
    });
  });
});

describe('string format validation', () => {
  it('should parse a string', () => {
    check({
      expects: {
        str: { type: 'string' },
        num: { type: 'string' }
      },
      input: {
        str: 'a string',
        num: '4'
      },
      output: {
        str: 'a string',
        num: '4'
      }
    });
  });

  it('should trim a string', () => {
    check({
      expects: {
        str: { type: 'string', trim: true }
      },
      input: {
        str: '  a string with whitespace  '
      },
      output: {
        str: 'a string with whitespace'
      }
    });
  });

  it('should require a string length', () => {
    error({
      expects: {
        str: { type: 'string', minLength: 20 }
      },
      input: {
        str: 'short string'
      }
    });
  });

  it('should fail on an invalid date format', () => {
    error({
      expects: {
        str: { type: 'string', format: 'date', pattern: 'YYYY-MM-DD' }
      },
      input: {
        str: '2020'
      }
    });
  });

  it('should pass on a valid date format', () => {
    check({
      expects: {
        str: { type: 'string', format: 'date', pattern: 'YYYY-MM-DD' }
      },
      input: {
        str: '2020-09-04'
      },
      output: {
        str: '2020-09-04'
      }
    });
  });

  it('should fail on invalid set membership', () => {
    error({
      expects: {
        str: { type: 'string', set: ['United States', 'Canada', 'Mexico'] }
      },
      input: {
        str: 'Spain'
      }
    });
  });

  it('should pass on valid set membership', () => {
    check({
      expects: {
        str: { type: 'string', set: ['United States', 'Canada', 'Mexico'] }
      },
      input: {
        str: 'United States'
      },
      output: {
        str: 'United States'
      }
    });
  });

  it('should escape an html string to plain text', () => {
    check({
      expects: {
        str: { type: 'string', format: 'text' }
      },
      input: {
        str: '<script>alert("pwned")</script>'
      },
      output: {
        str: '&lt;script&gt;alert(&quot;pwned&quot;)&lt;/script&gt;'
      }
    });
  });

  it('should validate a regex', () => {
    check({
      expects: {
        str: { type: 'string', format: 'regex', pattern: /[A-Z]+/ }
      },
      input: {
        str: 'ABC'
      },
      output: {
        str: 'ABC'
      }
    });
  });

  it('should fail on an invalid regex', () => {
    error({
      expects: {
        str: { type: 'string', format: 'regex', pattern: /[A-Z]+/ }
      },
      input: {
        str: '123'
      }
    });
  });

  it('should only accept characteres in the "identifier" pattern by default', () => {
    check({
      expects: {
        str: { type: 'string' }
      },
      input: {
        str: 'should block | but not +'
      },
      output: {
        str: 'should block ? but not +'
      }
    });
  });

  it('should only accept characteres in the "name" pattern', () => {
    check({
      expects: {
        str: { type: 'string', format: 'name' }
      },
      input: {
        str: '<b>not a name</b>'
      },
      output: {
        str: '?b?not a name??b?'
      }
    });
  });

  it('expects an alphanumeric string', () => {
    check({
      expects: {
        str: { type: 'string', format: 'alphanumeric' }
      },
      input: {
        str: 'abcd1234+'
      },
      output: {
        str: 'abcd1234?'
      }
    });
  });

  it('should let anything through', () => {
    check({
      expects: {
        str: { type: 'string', format: 'unsafe' }
      },
      input: {
        str: "Robert'); DROP TABLE Students;--"
      },
      output: {
        str: "Robert'); DROP TABLE Students;--"
      }
    });
  });
});

describe('objects and arrays', () => {
  it('handle arrays', () => {
    check({
      expects: {
        ints: { type: 'array', items: { type: 'integer' } },
        strings: { type: 'array', items: { type: 'string' } },
        arrays: { type: 'array', items: { type: 'array', items: { type: 'integer' } } }
      },
      input: {
        ints: ['1', '2', '3'],
        strings: ['abc', 'def', 'ghi'],
        arrays: [
          [1, 2, 3],
          [4, 5, 6]
        ]
      },
      output: {
        ints: [1, 2, 3],
        strings: ['abc', 'def', 'ghi'],
        arrays: [
          [1, 2, 3],
          [4, 5, 6]
        ]
      }
    });
  });

  it('accepts any object', () => {
    check({
      expects: {
        any: { type: 'object', format: 'any' }
      },
      input: {
        any: { str: 'accepts anything' }
      },
      output: {
        any: { str: 'accepts anything' }
      }
    });
  });

  it('accepts an object with a specified schema', () => {
    check({
      expects: {
        object: {
          type: 'object',
          properties: { int: { type: 'integer' }, str: { type: 'string' } }
        }
      },
      input: {
        object: { int: 5, str: 'abc' }
      },
      output: {
        object: { int: 5, str: 'abc' }
      }
    });
  });
});
