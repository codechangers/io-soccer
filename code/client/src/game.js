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
    g.addCharacters('badGuys', 1);
    g.setSize(2100, 2100);
    g.cameraBounds();
  }

  preload() {
    g.loadImage('players', 'characters/circle1.png');
    g.loadImage('badGuys', 'characters/circle2.png');
    g.loadImage('grass', 'grass.jpg');
  }

  create() {
    g.useLoginScreen(
      (name) => g.connect({ name }),
      'SUPER SOCCER',
      'USERNAME',
      'PLAY NOW'
    );
    g.setupKeys(keys);
    g.drawBackground('grass');
    g.getCharacters(
      'players',
      (player) => {
        g.handleLeaderboard('players', 'SCOREBOARD');
        if (player.id == g.myId()) {
          g.cameraFollow(player.sprite);
        }
      }, // On Add
      () => {
        g.handleLeaderboard('players', 'SCOREBOARD');
      } // On Remove
    );
    g.getCharacters('badGuys');
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
