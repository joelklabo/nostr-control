const SubscriptionFixtures = require('./fixtures.js');
const Formatter = require('./formatter.js');

describe('Formatter', () => {
	
	test('channel_opened', () => {
		const notification = SubscriptionFixtures.channel_opened
		const formatted = Formatter.channel_opened(notification)
		expect(formatted).toBe('100000 sat channel opened with 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f')
	})

	test('channel_open_failed', () => {
		const notification = SubscriptionFixtures.channel_open_failed
		const formatted = Formatter.channel_open_failed(notification)
		expect(formatted).toBe('Channel open failed with: a2d0851832f0e30a0cf778a826d72f077ca86b69f72677e0267f23f63a0599b')
	})
});
