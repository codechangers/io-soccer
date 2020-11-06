const Room = require('colyseus').Room;
const ServerLib = require('../../../../../src/server');
const g = new ServerLib();

module.exports = class MyRoom extends Room {
  onInit() {
    g.setup(this);
    g.setupCharacters('players', 'circle');
    g.setupCharacters('balls', 'circle');
    g.createACharacter('balls', g.nextCharacterId('balls'), { x: 600, y: 600 });
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
      buy3Block: () => g.purchase(player, 'score', 10, 'blocks3'),
      buy5Block: () => g.purchase(player, 'score', 15, 'blocks5'),
    };
    g.handleActions(actions, data);
  }

  onUpdate() {
    g.handleCollision('players', 'balls', (player, ball) => {
      player.score += 100;
      g.deleteACharacter('balls', ball.id);
    });
  }

  onLeave(client) {
    g.deleteACharacter('players', client.sessionId);
  }
};
