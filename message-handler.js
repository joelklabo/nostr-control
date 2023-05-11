import EventEmitter from 'events'

class MessageHandler extends EventEmitter {
	constructor() {
		super()
	}

	handle(message) {
		if (message.startsWith('/')) {
			const trimmed = message.substring(1)
			const args = trimmed.split(' ').slice(1)
			const command = trimmed.split(' ')[0]
			switch (command.toLowerCase()) {
				case 'help':
					this.emit('help')
					break
				case 'version':
					this.emit('version')
					break
				case 'info':
					this.emit('info')
					break
				case 'invoice':
					// args should be [amount_sats, label, description]
					if (args.length !== 3) {
						this.emit('error', 'invoice command must have 3 arguments [amount_sats, label, description]')
						break
					} else {
						this.emit('invoice', args)
						break
					}
				case 'address':
					this.emit('address')
					break
				case 'channels':
					this.emit('channels')
					break
				case 'donate':
					this.emit('donate')
					break
				case 'issue':
					this.emit('issue')
					break
				case 'pay':
					if (args.length !== 1) {
						this.emit('error', 'pay command must have 1 argument [bolt11]')
						break
					} else {
						this.emit('pay', args)
						break
					}
				case 'quiet':
					this.emit('quiet')
					break
				case 'silent':
					this.emit('silent')
					break
				case 'verbose':
					this.emit('verbose')
					break
				default:
					this.emit('unknown')
					break
			}
		} else {
			this.emit('error', 'must start with a slash /')
		}
	}
}


export default MessageHandler