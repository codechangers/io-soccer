const Phaser = require('phaser');
const ClientLib = require('../../../../../src/client');
const g = new ClientLib();

const keyCodes = Phaser.Input.Keyboard.KeyCodes;
const keys = {
  w: keyCodes.W,
  s: keyCodes.S,
  a: keyCodes.A,
  d: keyCodes.D,
  up: keyCodes.UP,
  down: keyCodes.DOWN,
  left: keyCodes.LEFT,
  right: keyCodes.RIGHT,
};

module.exports = class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    g.setup(this);
    g.addCharacters('players', 0.5);
    g.addLocations('safeZones', 2);
    g.addLocations('scoreZones', 2);
    g.addResources('balls');
    g.setSize(2100, 2100);
    g.cameraBounds();
  }

  preload() {
    g.loadImage('players', 'characters/circle1.png');
    g.loadImage('safeZones', 'blocks/block5.png');
    g.loadImage('scoreZones', 'blocks/block3.png');
    g.loadImage('grass', 'grass.jpg');
    g.loadImage('balls', 'ball.png');
    g.loadImage('blockItem', 'blocks/block-blank3.png');
  }

  create() {
    g.useLoginScreen(
      (name) => g.connect({ name, score: 0, attached: { blockItem: null } }),
      'SUPER SOCCER',
      'USERNAME',
      'PLAY NOW'
    );
    g.setupKeys(keys);
    g.drawBackground('grass');
    g.getCharacters(
      'players',
      (player) => {
        player.sprite.depth = 1;
        g.handleLeaderboard('players', 'SCOREBOARD');
        if (player.id == g.myId()) {
          g.cameraFollow(player.sprite);
        }
      }, // On Add
      () => g.handleLeaderboard('players', 'SCOREBOARD'), // On Remove
      (id, attr, value) => {
        g.handleLeaderboard('players', 'SCOREBOARD');
        if (attr == 'rotation') {
          this.players[id].sprite.rotation = value;
        }
      } // On Update
    );
    g.getLocations('safeZones');
    g.getLocations('scoreZones');
    g.getResources('balls', (ball) => ball.sprite.setScale(0.25));
  }

  update() {
    if (g.canSend()) {
      const { up, down, left, right, w, a, s, d } = g.getKeysDown();
      if (up || w) g.sendAction('moveUp');
      if (down || s) g.sendAction('moveDown');
      if (left || a) g.sendAction('moveLeft');
      if (right || d) g.sendAction('moveRight');
    }
  }
};
