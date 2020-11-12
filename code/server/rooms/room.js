const Room = require('colyseus').Room;
const ServerLib = require('../../../../../src/server');
const g = new ServerLib();

module.exports = class MyRoom extends Room {
  onInit() {
    g.setup(this);
    g.setupCharacters('players', 'circle');
    g.setupLocations('safeZones');
    g.setupResources('balls');
    g.createALocation(
      'safeZones',
      g.nextLocationId('safeZones'),
      { x: 500, y: 500 },
      '0DCBB1',
      (player) => (player.rotation = Math.PI)
    );
    g.setupLocations('scoreZones');
    g.createALocation(
      'scoreZones',
      g.nextLocationId('scoreZones'),
      { x: 1500, y: 700 },
      '',
      (player) => (player.score += 1)
    );
    g.setBounds(2100, 2100);
    g.createAResource('balls', 600, 600);
  }

  onJoin(client, data) {
    g.createACharacter('players', client.sessionId, {
      x: 200,
      y: 200,
      ...data,
    });
    g.attachTo('players', client.sessionId, {
      name: 'blockItem',
      x: 50,
      y: 50,
      type: 'item',
      image: 'blockItem',
      scale: 0.25,
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

  onUpdate() {
    Object.values(this.state.players).forEach((p) => (p.rotation = 0));
    g.handleLocations('safeZones', 'players');
    g.handleLocations('scoreZones', 'players');
    g.follow('players', 'balls', 100, 0.2);
  }

  onLeave(client) {
    g.deleteACharacter('players', client.sessionId);
  }
};
