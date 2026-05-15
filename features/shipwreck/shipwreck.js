/**
 * features/shipwreck/shipwreck.js
 * 難破船カードデッキ管理: 山札の構築・シャッフル・1枚引き
 * カードの効果は未定義（今後のルール追加で実装予定）
 */
(function () {
  const Shipwreck = {
    deck: [],

    CARDS: [
      { id:  1, name: '錆びたナイフ' },
      { id:  2, name: '古い缶詰' },
      { id:  3, name: '腐食した銃' },
      { id:  4, name: '救命ロープ' },
      { id:  5, name: '燃料タンク' },
      { id:  6, name: '医療キット' },
      { id:  7, name: '双眼鏡' },
      { id:  8, name: '火起こし道具' },
      { id:  9, name: 'シグナルフレア' },
      { id: 10, name: '古びた海図' },
    ],

    init: function () {
      this.deck = [...this.CARDS];
      this._shuffle();
    },

    /** 山札の一番上から1枚引く。山札切れなら再シャッフル */
    draw: function () {
      if (this.deck.length === 0) {
        this.deck = [...this.CARDS];
        this._shuffle();
      }
      return this.deck.pop();
    },

    remaining: function () {
      return this.deck.length;
    },

    _shuffle: function () {
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    },
  };

  window.Shipwreck = Shipwreck;
})();
