function randomValue(min, max) {
  return Math.random() * (max - min) + min;
}

module.exports = randomValue;
