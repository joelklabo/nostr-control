const SubscriptionFixtures = require('./fixtures.js');
const Formatter = require('./formatter.js');

describe('Formatter', () => {
	
	test('channel_opened', () => {
		const notification = SubscriptionFixtures.channel_opened;
		const formatted = Formatter.format(notification);
		expect(formatted).toBe('Channel opened');
	})
});
