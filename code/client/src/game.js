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
  one: keyCodes.ONE,
  two: keyCodes.TWO,
  three: keyCodes.THREE,
};

module.exports = class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    g.setup(this);
    g.addCharacters('players', 0.5);
    g.addCharacters('item2', 0.25);
    g.addLocations('safeZones', 2);
    g.addLocations('scoreZones', 2);
    g.addResources('balls');
    g.setSize(2100, 2100);
    g.cameraBounds();
  }

  preload() {
    g.loadImage('players', 'characters/circle1.png');
    g.loadImage('safeZones', 'blocks/block5.png');
    g.loadImage('grass', 'grass.jpg');
    g.loadImage('balls', 'ball.png');
    g.loadImage('blockItem', 'blocks/block-blank3.png');
    g.loadImage('item2', 'blocks/block-blank5.png');
    g.loadImage('blobbert', 'characters/circle1.png');
    g.loadImage('grunch', 'characters/circle2.png');
    g.loadImage('neon', 'characters/circle3.png');
    g.loadImage('nimbo', 'characters/circle4.png');
    g.loadImage('tangles', 'characters/circle5.png');
  }

  create() {
    g.useLoginScreen(
      (name, spriteName) =>
        g.connect({
          name,
          spriteName,
          score: 0,
          attached: { blockItem: null, item2: null },
          items: {},
          rotation: 0,
          animations: {},
        }),
      'SUPER SOCCER',
      'USERNAME',
      'PLAY NOW'
    );
    g.usePlayerSelectScreen({
      blobbert: 'characters/circle1.png',
      grunch: 'characters/circle2.png',
      neon: 'characters/circle3.png',
      nimbo: 'characters/circle4.png',
      tangles: 'characters/circle5.png',
    });
    g.useHowToScreen(
      'How to play',
      {
        'Press [W] or [up arrow]': 'Move character up',
        'Press [S] or [down arrow]': 'Move character down',
        'Press [A] or [left arrow]': 'Move character left',
        'Press [D] or [right arrow]': 'Move character right',
        'Press [1]': 'Select block item',
        'Press [2]': 'Select item2',
        'Mouse Click': 'Use current item',
      },
      {
        'Macuyler Dunn': 'Developer',
        'Sydney Sneddon': 'Designer',
      }
    );
    g.useItemBar(3);
    g.setupKeys(keys);
    g.drawBackground('grass');
    g.getCharacters(
      'players',
      (player) => {
        player.sprite.depth = 1;
        g.handleLeaderboard('players', 'SCOREBOARD');
        if (player.id === g.myId()) {
          g.cameraFollow(player.sprite);
        }
        player.sprite.rotation = player.rotation;
      }, // On Add
      () => g.handleLeaderboard('players', 'SCOREBOARD'), // On Remove
      () => {
        g.handleLeaderboard('players', 'SCOREBOARD');
      } // On Update
    );
    g.getCharacters(
      'item2',
      () => {},
      () => {},
      (id, attr, value) => {
        if (attr === 'rotation') {
          this.item2[id].rotation = value;
        }
      }
    );
    g.getLocations('safeZones');
    g.getLocations('scoreZones');
    g.getResources('balls', (ball) => ball.sprite.setScale(0.25));
  }

  update() {
    if (g.canSend()) {
      const {
        up,
        down,
        left,
        right,
        w,
        a,
        s,
        d,
        one,
        two,
        three,
      } = g.getKeysDown();
      if (up || w) g.sendAction('moveUp');
      if (down || s) g.sendAction('moveDown');
      if (left || a) g.sendAction('moveLeft');
      if (right || d) g.sendAction('moveRight');
      if (one) g.sendAction('switchToItem1');
      else if (two) g.sendAction('switchToItem2');
      else if (three) g.sendAction('switchToItem3');
    }
  }

  click(x, y) {
    if (g.canSend()) {
      g.sendAction('useItem', { x, y });
    }
  }
};
