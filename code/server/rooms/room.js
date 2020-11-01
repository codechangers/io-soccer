const Room = require('colyseus').Room;
const ServerLib = require('../../../../../src/server');
const g = new ServerLib();

module.exports = class MyRoom extends Room {
  onInit() {
    g.setup(this);
    g.setupCharacters('players', 'box');
    g.setupCharacters('badGuys', 'circle');
    g.useBarrier('players', 'badGuys');
    g.createACharacter('badGuys', g.nextCharacterId('badGuys'), {
      x: 500,
      y: 500,
    });
    g.setBounds(2100, 2100);
  }

  onJoin(client, data) {
    g.createACharacter('players', client.sessionId, {
      x: 200,
      y: 200,
      ...data,
    });
  }

  onMessage(client, data) {
    const player = g.getACharacter('players', client.sessionId);
    const speed = 10;
    const actions = {
      moveUp: () => g.move(player, 'y', -speed),
      moveDown: () => g.move(player, 'y', speed),
      moveLeft: () => g.move(player, 'x', -speed),
      moveRight: () => g.move(player, 'x', speed),
    };
    g.handleActions(actions, data);
  }

  onLeave(client) {
    g.deleteACharacter('players', client.sessionId);
  }
};
