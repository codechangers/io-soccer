const { Room } = require('colyseus');
const ServerLib = require('../../../../../src/server');

const g = new ServerLib();

module.exports = class MyRoom extends Room {
  onInit() {
    g.setup(this);
    g.setupCharacters('players', 'circle');
    g.setupCharacters('item2');
    g.setupLocations('safeZones');
    g.setupResources('balls');
    g.createALocation(
      'safeZones',
      g.nextLocationId('safeZones'),
      { x: 500, y: 500 },
      '0DCBB1',
      (player) => g.playAnimation(player, 'rotation', 1, 1000)
    );
    g.setupLocations('scoreZones');
    g.createALocation(
      'scoreZones',
      g.nextLocationId('scoreZones'),
      { x: 1500, y: 700 },
      '',
      (player) => {
        player.score += 1;
      }
    );
    g.setBounds(2100, 2100);
    g.createAResource('balls', 600, 600);
    g.createNewItem(
      'blockItem',
      'blocks/block-blank3.png',
      (char, data, actions) => actions.swingItem()
    );
    g.createNewItem(
      'item2',
      'blocks/block-blank5.png',
      (char, data, actions) => {
        console.log(data);
        actions.throwItem(data.x, data.y);
      }
    );
  }

  onJoin(client, data) {
    g.createACharacter('players', client.sessionId, {
      x: 200,
      y: 200,
      ...data,
    });
    g.addItemToCharacter(
      g.getACharacter('players', client.sessionId),
      'blockItem'
    );
    g.addItemToCharacter(g.getACharacter('players', client.sessionId), 'item2');
  }

  onMessage(client, data) {
    const player = g.getACharacter('players', client.sessionId);
    const speed = 10;
    const actions = {
      moveUp: () => g.move(player, 'y', -speed),
      moveDown: () => g.move(player, 'y', speed),
      moveLeft: () => g.move(player, 'x', -speed),
      moveRight: () => g.move(player, 'x', speed),
      useItem: () => g.useItem(player, data),
      switchToItem1: () => {
        g.attachTo('players', client.sessionId, {
          item: g.getItem('blockItem'),
          x: 40,
          y: 40,
          scale: 0.25,
        });
        g.unAttach('players', client.sessionId, 'item2');
        g.switchItem(player, 0);
      },
      switchToItem2: () => {
        g.attachTo('players', client.sessionId, {
          item: g.getItem('item2'),
          x: 40,
          y: 40,
          scale: 0.25,
        });
        g.unAttach('players', client.sessionId, 'blockItem');
        g.switchItem(player, 1);
      },
      switchToItem3: () => {
        g.unAttach('players', client.sessionId, 'blockItem');
        g.unAttach('players', client.sessionId, 'item2');
        g.switchItem(player, 2);
      },
    };
    g.handleActions(actions, data);
  }

  onUpdate() {
    g.handleLocations('safeZones', 'players');
    g.handleLocations('scoreZones', 'players');
    g.follow('players', 'balls', 100, 0.2, (player, ball) => {
      ball.rotation = g.getRotationTowards(ball, player.x, player.y);
    });
    g.handleAnimations('players');
    g.handleAnimations('item2');
    g.handleItemCollision('players', 'blockItem', 'balls', (item, ball) => {
      console.log('hit');
      g.deleteAResource('balls', ball.id);
    });
  }

  onLeave(client) {
    g.deleteACharacter('players', client.sessionId);
  }
};
