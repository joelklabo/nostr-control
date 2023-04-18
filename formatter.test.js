const SubscriptionFixtures = require('./fixtures.js');
const Formatter = require('./formatter.js');

describe('Formatter', () => {
	
	test('channel_opened', () => {
		const notification = SubscriptionFixtures.channel_opened
		const formatted = Formatter.channel_opened(notification)
		expect(formatted).toBe('🆕 100000 sat channel opened with 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f')
	})

	test('channel_open_failed', () => {
		const notification = SubscriptionFixtures.channel_open_failed
		const formatted = Formatter.channel_open_failed(notification)
		expect(formatted).toBe('💔 channel open failed with: a2d0851832f0e30a0cf778a826d72f077ca86b69f72677e0267f23f63a0599b')
	})

	test('channel_state_changed', () => {
		const notification = SubscriptionFixtures.channel_state_changed
		const formatted = Formatter.channel_state_changed(notification)
		expect(formatted).toBe('🍃 channel state changed with peer: 03bc9337c7a28bb784d67742ebedd30a93bacdf7e4ca16436ef3798000242b2251 CHANNELD_NORMAL -> CHANNELD_SHUTTING_DOWN')
	})

	test('connect', () => {
		const notification = SubscriptionFixtures.connect
		const formatted = Formatter.connect(notification)
		expect(formatted).toBe('🤝 connected to peer: 02f6725f9c1c40333b67faea92fd211c183050f28df32cac3f9d69685fe9665432 direction in')
	})

	test('disconnect', () => {
		const notification = SubscriptionFixtures.disconnect
		const formatted = Formatter.disconnect(notification)
		expect(formatted).toBe('👋 disconnected from peer: 02f6725f9c1c40333b67faea92fd211c183050f28df32cac3f9d69685fe9665432')
	})

	test('invoice_payment', () => {
		const notification = SubscriptionFixtures.invoice_payment
		const formatted = Formatter.invoice_payment(notification)
		expect(formatted).toBe('🧾 10 sat paid for unique-label-for-invoice')
	})

	test('invoice_creation', () => {
		const notification = SubscriptionFixtures.invoice_creation
		const formatted = Formatter.invoice_creation(notification)
		expect(formatted).toBe('💸 10 sat invoice created for unique-label-for-invoice')
	})

	test('warning', () => {
		const notification = SubscriptionFixtures.warning
		const formatted = Formatter.warning(notification)
		expect(formatted).toBe('🚨 warning: Peer permanent failure in CHANNELD_NORMAL: lightning_channeld: sent ERROR bad reestablish dataloss msg')
	})

	test('forward_event', () => {
		const notification = SubscriptionFixtures.forward_event
		const formatted = Formatter.forward_event(notification)
		expect(formatted).toBe('🔀 100000 sat to 103x1x1 from 103x2x1 for a fee of 1 sat')
	})

	test('sendpay_success', () => {
		const notification = SubscriptionFixtures.sendpay_success
		const formatted = Formatter.sendpay_success(notification)
		expect(formatted).toBe('👍 payment of 100000 sat to 035d2b1192dfba134e10e540875d366ebc8bc353d5aa766b80c090b39c3a5d885d succeeded')
	})

	test('sendpay_failure', () => {
		const notification = SubscriptionFixtures.sendpay_failure
		const formatted = Formatter.sendpay_failure(notification)
		expect(formatted).toBe('👎 payment failed to 035d2b1192dfba134e10e540875d366ebc8bc353d5aa766b80c090b39c3a5d885d failed: WIRE_UNKNOWN_NEXT_PEER (reply from remote)')
	})

	test('coin_movement', () => {
		const notification = SubscriptionFixtures.coin_movement
		const formatted = Formatter.coin_movement(notification)
		expect(formatted).toBe('🪙 chain_mvt credit: 2000000 sat, debit: 0 sat')
	})

	test('balance_snapshot', () => {
		const formatted = Formatter.balance_snapshot()
		expect(formatted).toBe('TODO: Balance snapshot event')
	})

	test('block', () => {
		const notification = SubscriptionFixtures.block
		const formatted = Formatter.block(notification)
		expect(formatted).toBe('🧱 753304 000000000000000000034bdb3c01652a0aa8f63d32f949313d55af2509f9d245')
	})

	test('openchannel_peer_sigs', () => {
		const notification = SubscriptionFixtures.openchannel_peer_sigs
		const formatted = Formatter.openchannel_peer_sigs(notification)
		expect(formatted).toBe('✍️ open channel peer sigs a2d0851832f0e30a0cf778a826d72f077ca86b69f72677e0267f23f63a0599b4')
	})

	test('shutdown', () => {
		const notification = SubscriptionFixtures.shutdown
		const formatted = Formatter.shutdown(notification)
		expect(formatted).toBe('🔌 Shutting down')
	})
})
