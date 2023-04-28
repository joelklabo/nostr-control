import test from 'ava';
import SubscriptionFixtures from './fixtures.js';
import Formatter from './formatter.js';

test('channel_opened', t => {
	const message = Formatter.channel_opened(SubscriptionFixtures.channel_opened);
	const sats = '100000⚡️'
	const peer = '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f'
	t.regex(message, new RegExp(sats));
	t.regex(message, new RegExp(peer));
});

test('channel_open_failed', t => {
	const message = Formatter.channel_open_failed(SubscriptionFixtures.channel_open_failed);
	const channel_id = 'a2d0851832f0e30a0cf778a826d72f077ca86b69f72677e0267f23f63a0599b'
	t.regex(message, new RegExp(channel_id));
});

test('channel_state_changed', t => {
	const message = Formatter.channel_state_changed(SubscriptionFixtures.channel_state_changed);
	const peer_id = '03bc9337c7a28bb784d67742ebedd30a93bacdf7e4ca16436ef3798000242b2251'
	const old_state = 'CHANNELD_NORMAL'
	const new_state = 'CHANNELD_SHUTTING_DOWN'
	t.regex(message, new RegExp(peer_id));
	t.regex(message, new RegExp(old_state));
	t.regex(message, new RegExp(new_state));
});

test('connect', t => {
	const message = Formatter.connect(SubscriptionFixtures.connect);
	const id = '02f6725f9c1c40333b67faea92fd211c183050f28df32cac3f9d69685fe9665432'
	const direction = '(in)'
	t.regex(message, new RegExp(id));
	t.regex(message, new RegExp(direction));
});

test('disconnect', t => {
	const message = Formatter.disconnect(SubscriptionFixtures.disconnect);
	const id = '02f6725f9c1c40333b67faea92fd211c183050f28df32cac3f9d69685fe9665432'
	t.regex(message, new RegExp(id));
});

test('invoice_payment', t => {
	const message = Formatter.invoice_payment(SubscriptionFixtures.invoice_payment);
	const sats = '10⚡'
	t.regex(message, new RegExp(sats));
});

test('invoice_creation', t => {
	const message = Formatter.invoice_creation(SubscriptionFixtures.invoice_creation);
	const sats = '10⚡'
	t.regex(message, new RegExp(sats));
});

test('sendpay_success', t => {
	const message = Formatter.sendpay_success(SubscriptionFixtures.sendpay_success);
	const id = '035d2b1192dfba134e10e540875d366ebc8bc353d5aa766b80c090b39c3a5d885d'
	const sats = '100000⚡'
	t.regex(message, new RegExp(id));
	t.regex(message, new RegExp(sats));
});

test('sendpay_failure', t => {
	const message = Formatter.sendpay_failure(SubscriptionFixtures.sendpay_failure);
	const destination = '035d2b1192dfba134e10e540875d366ebc8bc353d5aa766b80c090b39c3a5d885d'
	const error = 'WIRE_UNKNOWN_NEXT_PEER'
	t.regex(message, new RegExp(destination));
	t.regex(message, new RegExp(error));
});

test('coin_movement', t => {
	const message = Formatter.coin_movement(SubscriptionFixtures.coin_movement);
	const type = 'chain_mvt'
	const credit = '2000000000'
	const debit = '0'
	t.regex(message, new RegExp(type));
	t.regex(message, new RegExp(credit));
	t.regex(message, new RegExp(debit));
});