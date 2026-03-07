const colorize = (colorCode) => (str) => `\x1b[${colorCode}m${str}\x1b[0m`;

export const red = colorize(31);
export const green = colorize(32);
export const yellow = colorize(33);
export const blue = colorize(34);
export const magenta = colorize(35);
export const cyan = colorize(36);
export const brightRed = colorize(91);
export const brightGreen = colorize(92);
export const brightYellow = colorize(93);
export const brightBlue = colorize(94);
export const brightMagenta = colorize(95);
export const brightCyan = colorize(96);
export const white = colorize(97);
