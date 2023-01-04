const { REST } = require('@discordjs/rest')
const querystring = require('querystring')

const REST_OPTS = {
    version: 10,
    timeout: 60000, // Request will be aborted after this
}

class DiscordAPI {
    /**
     * Create discord API wrapper
     * @param opts
     */
    constructor(opts) {
        this.channelId = opts.channelId
        // Prepare rest opts
        const restOpts = { ...REST_OPTS, ...opts.restOpts }
        // By default, @discordjs/rest package adds `Bot` in every outgoing
        // request's auth header but for user token it's not needed so remove the prefix
        if (opts.token.startsWith('USER')) restOpts.authPrefix = ''
        this.rest = new REST(restOpts).setToken(opts.token)
    }

    /**
     * Fetch messages
     * @param {Object} query
     * @return {Promise<*>}
     */
    async fetchMessages(query) {
        const endpoint = `/channels/${this.channelId}/messages`

        return this.rest.get(endpoint, { query: querystring.encode(query) })
    }

    /**
     * Send message on channel
     * @param {Object|String} content
     * @param {Object[]} files
     * @return {Promise<*>}
     */
    async createMessage(content, files = []) {
        const endpoint = `/channels/${this.channelId}/messages`
        const requestData = {
            files,
            body: {
                content: typeof content === 'string' ? content : JSON.stringify(content),
            },
        }

        return this.rest.post(endpoint, requestData)
    }

    /**
     * Delete message for given messageId
     * @param {String} messageId
     * @return {Promise<*>}
     */
    async deleteMessage(messageId) {
        const endpoint = `/channels/${this.channelId}/messages/${messageId}`

        return this.rest.delete(endpoint)
    }
}

module.exports = DiscordAPI
