/**
 * features/weather/weather.js
 * 天候カード管理: デッキ構築・シャッフル・1枚めくり
 * 雨量: 0〜3 (10枚デッキ: 0×2, 1×3, 2×3, 3×2)
 */
(function () {
  const Weather = {
    deck: [],
    current: null,   // 現在めくられているカードの雨量 (null=未公開)

    CARDS: [0, 0, 1, 1, 1, 2, 2, 2, 3, 3],

    LABEL: {
      0: { icon: '☀️', text: '快晴',     desc: '雨なし' },
      1: { icon: '🌦️', text: '小雨',     desc: '雨量: 1' },
      2: { icon: '🌧️', text: '雨',       desc: '雨量: 2' },
      3: { icon: '⛈️', text: '大雨',     desc: '雨量: 3' },
    },

    init: function () {
      this.deck = [...this.CARDS];
      this._shuffle();
      this.current = null;
    },

    /** リーダーがカードを1枚めくる。デッキ切れなら再シャッフル */
    draw: function () {
      if (this.deck.length === 0) {
        this.deck = [...this.CARDS];
        this._shuffle();
      }
      this.current = this.deck.pop();
      return this.current;
    },

    getLabel: function () {
      if (this.current === null) return null;
      return this.LABEL[this.current];
    },

    _shuffle: function () {
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    },
  };

  window.Weather = Weather;
})();
