const Room = require('colyseus').Room;
const ServerLib = require('../../../../../src/server');
const g = new ServerLib();

module.exports = class MyRoom extends Room {
  onInit() {
    g.setup(this);
    g.setupCharacters('players');
    g.setupCharacters('badGuys');
    g.createACharacter('badGuys', g.nextCharacterId('badGuys'), {
      x: 500,
      y: 500,
    });
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
      moveUp: () => (player.y -= speed),
      moveDown: () => (player.y += speed),
      moveLeft: () => (player.x -= speed),
      moveRight: () => (player.x += speed),
    };
    g.handleActions(actions, data);
  }

  onUpdate() {
    g.handleCircleOnBoxCollision('players', 'badGuys', (r) => {
      console.log('We collided!!!', r);
    });
  }

  onLeave(client) {
    g.deleteACharacter('players', client.sessionId);
  }
};
