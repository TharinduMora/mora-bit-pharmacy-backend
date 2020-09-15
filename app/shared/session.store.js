module.exports = {
    MAX_SESSIONS: 100,
    ADMIN_SESSIONS: {},
    ADMIN_USER_SESSIONS: {},
    ADMIN_SESSIONS_IDs: [],

    addAdminSession(sessionId, admin) {
        const existingSessionId = this.ADMIN_USER_SESSIONS[admin.loginName];
        if (existingSessionId) {
            this.removeAdminSession(existingSessionId)
        }
        if (this.ADMIN_SESSIONS_IDs.length >= this.MAX_SESSIONS) {
            this.removeAdminSession(this.ADMIN_SESSIONS_IDs[0]);
        }
        this.ADMIN_SESSIONS[sessionId] = admin;
        this.ADMIN_USER_SESSIONS[admin.loginName] = sessionId;
        this.ADMIN_SESSIONS_IDs.push(sessionId);
    },

    removeAdminSession(sessionId) {
        let loginName = this.ADMIN_SESSIONS[sessionId].loginName;
        delete this.ADMIN_SESSIONS[sessionId];
        delete this.ADMIN_USER_SESSIONS[loginName];
        this.ADMIN_SESSIONS_IDs.splice(ADMIN_SESSIONS_IDs.indexOf(sessionId), 1);
    },

    getAdminSession(sessionId) {
        return this.ADMIN_SESSIONS[sessionId];
    }
};