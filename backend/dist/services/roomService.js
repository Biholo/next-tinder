"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoomService {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(roomId, hostId, maxPlayers) {
        const room = {
            id: roomId,
            name: `Room ${roomId}`,
            gameType: "werewolf",
            players: [],
            maxPlayers,
            status: "waiting",
            hostId,
            settings: this.getDefaultSettings(),
        };
        this.rooms.set(roomId, room);
        return room;
    }
    getRoom(roomId) {
        return this.rooms.get(roomId);
    }
    updateRoomSettings(roomId, hostId, newSettings) {
        const room = this.rooms.get(roomId);
        if (!room || room.hostId !== hostId)
            return false;
        room.settings = Object.assign(Object.assign({}, room.settings), newSettings);
        return true;
    }
    addPlayer(roomId, player) {
        const room = this.rooms.get(roomId);
        if (!room || room.players.length >= room.maxPlayers)
            return false;
        room.players.push(player);
        return true;
    }
    removePlayer(roomId, playerId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        room.players = room.players.filter(p => p.id !== playerId);
    }
    deleteRoom(roomId) {
        this.rooms.delete(roomId);
    }
    getDefaultSettings() {
        return {
            minPlayers: 4,
            maxPlayers: 12,
            rolesConfig: {
                "Loup-Garou": { min: 1, max: 3, current: 2 },
                "Voyante": { min: 0, max: 1, current: 1 },
                "Villageois": { min: 2, max: 8, current: 5 },
                "Sorcière": { min: 0, max: 1, current: 1 },
                "Chasseur": { min: 0, max: 1, current: 0 },
                "Cupidon": { min: 0, max: 1, current: 0 }
            },
            phaseDurations: {
                day: 45,
                night: 30
            },
            votingMode: "public",
            discussionEnabled: true,
            werewolfChatEnabled: true
        };
    }
}
exports.default = new RoomService();
//# sourceMappingURL=roomService.js.map