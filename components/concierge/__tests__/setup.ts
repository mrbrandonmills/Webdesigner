// Mock setup for concierge tests

// Mock framer-motion to properly handle props
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: new Proxy(
      {},
      {
        get: (target, prop) => {
          return React.forwardRef(({ children, ...props }: any, ref: any) => {
            // Remove framer-motion specific props before passing to DOM
            const {
              initial,
              animate,
              exit,
              transition,
              whileHover,
              whileTap,
              variants,
              ...cleanProps
            } = props;
            return React.createElement(prop as string, { ref, ...cleanProps }, children);
          });
        },
      }
    ),
    AnimatePresence: ({ children }: any) => children,
  };
});

// Mock scrollIntoView
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = jest.fn();
}

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === 'EEE, MMM d') return 'Mon, Jan 1';
    if (formatStr === 'h:mm a') return '10:30 am';
    return '10:00 AM';
  }),
  addDays: jest.fn((date, days) => new Date(2025, 0, days)),
  startOfWeek: jest.fn(() => new Date(2025, 0, 1)),
}));

// This file is just for setup, no tests
describe('setup', () => {
  it('is loaded', () => {
    expect(true).toBe(true);
  });
});
