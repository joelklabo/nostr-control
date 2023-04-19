import EventEmitter from 'events'

class MessageHandler extends EventEmitter {
	constructor() {
		super()
	}

	handle(message) {
		if (message.startsWith('/')) {
			message = message.substring(1)
			switch (message) {
				case message.startsWith('help'):
					this.emit('help')
					break
				case message.startsWith('info'):
					this.emit('info')
					break
				case message.startsWith('invoice'):
					let args = message.split(' ').slice(1)
					// args should be [amount_sats, label, description]
					if (args.length !== 3) {
						this.emit('error', 'invoice command must have 3 arguments [amount_sats, label, description]')
					} else {
						this.emit('invoice', args)
					}
			}
		} else {
			this.emit('error', 'must start with a slash (/)')
		}
	}
}


export default MessageHandler