class MillisatParser {
  static parseInput(input, shouldConvertToSats = false) {
    const regex = /^(\d+)(msat)?$/;
    const match = input.toString().match(regex);

    if (!match) {
      throw new Error('Invalid input format');
    }

    const millisats = parseInt(match[1], 10);

    if (shouldConvertToSats) {
      return Math.round(millisats / 1000);
    }

    return millisats;
  }
}

export default MillisatParser;