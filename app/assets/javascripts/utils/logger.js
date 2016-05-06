export default class Logger {
  constructor(label) {
    this.label = label;
  }

  log() {
    console.log(this.label, ...arguments);
  }

  error() {
    console.error(this.label, ...arguments);
  }

  warn() {
    console.warn(this.label, ...arguments);
  }
}

