export const getRndInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const delay = (ms: number) => {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
