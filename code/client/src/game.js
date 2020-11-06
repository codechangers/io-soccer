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
  tab: keyCodes.TAB,
};

module.exports = class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    g.setup(this);
    g.addCharacters('players', 0.5);
    g.addCharacters('balls', 0.25);
    g.setSize(2100, 2100);
    g.cameraBounds();
  }

  preload() {
    g.loadImage('players', 'characters/circle1.png');
    g.loadImage('balls', 'ball.png');
    g.loadImage('grass', 'grass.jpg');
  }

  create() {
    g.useLoginScreen(
      (name) => g.connect({ name, score: 0 }),
      'SUPER SOCCER',
      'USERNAME',
      'PLAY NOW'
    );
    g.useStore('Supa Store', [
      new g.StoreItem(
        'blocks/block3.png',
        'LVL 3 Block',
        'Points',
        10,
        'buy3Block'
      ),
      new g.StoreItem(
        'blocks/block5.png',
        'LVL 5 Block',
        'Points',
        15,
        'buy5Block'
      ),
    ]);
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
      () => g.handleLeaderboard('players', 'SCOREBOARD'), // On Remove
      () => g.handleLeaderboard('players', 'SCOREBOARD') // On Update
    );
    g.getCharacters('balls');
  }

  update() {
    if (g.canSend()) {
      const { up, down, left, right, w, a, s, d, tab } = g.getKeysDown();
      if (up || w) g.sendAction('moveUp');
      if (down || s) g.sendAction('moveDown');
      if (left || a) g.sendAction('moveLeft');
      if (right || d) g.sendAction('moveRight');
      if (tab) g.toggleStore();
      else g.unlockStore();
    }
  }
};
