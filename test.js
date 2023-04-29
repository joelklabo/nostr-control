import test from 'ava';
import MillisatParser from './millisat-parser.js';

test('parseInput - valid number input', t => {
  t.is(MillisatParser.parseInput(100000), 100000);
});

test('parseInput - valid string input', t => {
  t.is(MillisatParser.parseInput("100000"), 100000);
});

test('parseInput - valid string input with msat suffix', t => {
  t.is(MillisatParser.parseInput("100000msat"), 100000);
});

test('parseInput - convert to sats', t => {
  t.is(MillisatParser.parseInput(100000, true), 100);
});

test('parseInput - convert to sats from string input', t => {
  t.is(MillisatParser.parseInput("100000", true), 100);
});

test('parseInput - convert to sats from string input with msat suffix', t => {
  t.is(MillisatParser.parseInput("100000msat", true), 100);
});

test('parseInput - invalid input format', t => {
  const error = t.throws(() => {
    MillisatParser.parseInput("invalid_input");
  });

  t.is(error.message, 'Invalid input format');
});
