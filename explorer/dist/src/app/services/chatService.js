"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
exports.chatService = {
    async sendMessage(request) {
        const response = await fetch(process.env.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        return response.json();
    },
};
//# sourceMappingURL=chatService.js.map