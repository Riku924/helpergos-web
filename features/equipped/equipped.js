/**
 * features/equipped/equipped.js
 * 装備済みカードの管理（公開情報）
 * 手札（秘密）とは別に、装備したカードは全プレイヤーから見える
 */
(function () {
  const Equipped = {
    cards: {}, // { playerIdx: [card, ...] }

    init: function (numPlayers) {
      this.cards = {};
      for (let i = 0; i < numPlayers; i++) {
        this.cards[i] = [];
      }
    },

    add: function (playerIdx, card) {
      if (!this.cards[playerIdx]) this.cards[playerIdx] = [];
      this.cards[playerIdx].push(card);
    },

    get: function (playerIdx) {
      return this.cards[playerIdx] || [];
    },

    hasEffect: function (playerIdx, effectKey) {
      return (this.cards[playerIdx] || []).some(function (c) {
        return c.effect === effectKey;
      });
    },

    reset: function () {
      var self = this;
      Object.keys(self.cards).forEach(function (i) { self.cards[i] = []; });
    },
  };

  window.Equipped = Equipped;
})();
