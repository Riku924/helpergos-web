/**
 * features/hand/hand.js
 * プレイヤーごとの秘密手札を管理する
 * 他プレイヤーには枚数のみ公開、内容は本人だけが見る
 */
(function () {
  const Hand = {
    // { playerIdx: [card, ...] }
    cards: {},

    init: function (numPlayers) {
      this.cards = {};
      for (let i = 0; i < numPlayers; i++) {
        this.cards[i] = [];
      }
    },

    /** カードを手札に加える */
    add: function (playerIdx, card) {
      this.cards[playerIdx].push(card);
    },

    /** 手札の全カードを返す（本人確認後に呼ぶ） */
    get: function (playerIdx) {
      return this.cards[playerIdx] || [];
    },

    /** 手札の枚数（全員に公開） */
    count: function (playerIdx) {
      return (this.cards[playerIdx] || []).length;
    },

    reset: function () {
      Object.keys(this.cards).forEach(i => { this.cards[i] = []; });
    },
  };

  window.Hand = Hand;
})();
