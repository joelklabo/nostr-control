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

  static formatNumber(number) {
    const str = number.toString();
    const firstGroupLength = str.length % 3 || 3;
    const groups = [str.slice(0, firstGroupLength)];

    for (let i = firstGroupLength; i < str.length; i += 3) {
      groups.push(str.slice(i, i + 3));
    }

    return groups.join(",");
  }
}

export default MillisatParser;