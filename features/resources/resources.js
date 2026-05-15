/**
 * features/resources/resources.js
 * 人数に応じた水・食料の初期値テーブル
 */
(function () {
  const Resources = {
    INITIAL: {
       3: { water:  6, food:  5 },
       4: { water:  8, food:  7 },
       5: { water: 10, food:  8 },
       6: { water: 12, food: 10 },
       7: { water: 14, food: 12 },
       8: { water: 16, food: 13 },
       9: { water: 18, food: 15 },
      10: { water: 20, food: 16 },
      11: { water: 22, food: 18 },
      12: { water: 24, food: 20 },
    },

    /**
     * 指定した人数の初期値を返す
     * @param {number} numPlayers 3〜12
     * @returns {{ water: number, food: number }}
     */
    getInitial: function (numPlayers) {
      return this.INITIAL[numPlayers] || this.INITIAL[3];
    },
  };

  window.Resources = Resources;
})();
