import test from 'ava';
import fs from 'fs/promises';
import MillisatParser from './millisat-parser.js';
import Cache from './cache.js';

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

// Utility function for delaying the execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Test cases

test('cache loads and saves data', async t => {
  const key = 'testKey';
  const value = 'testValue';
  const fetchFunc = async () => value;
  const cache = new Cache(fetchFunc, 'test_cache.json');

  // Test data retrieval
  const fetchedValue = await cache.get(key);
  t.is(fetchedValue, key);

  // Wait for the cache to update in the background
  await delay(1000);

  // Test if the data was cached
  const cachedValue = await cache.get(key);
  t.is(cachedValue, value);

  // Clean up test cache file
  await fs.unlink('test_cache.json');
});

test('cache returns key immediately when not found in cache', async t => {
  const key = 'nonExistentKey';
  const value = 'defaultValue';
  const fetchFunc = async () => value;
  const cache = new Cache(fetchFunc);

  const fetchedValue = await cache.get(key);
  t.is(fetchedValue, key);
});