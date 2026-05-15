/**
 * features/paralysis/paralysis.js
 * 毒蛇に噛まれた際の麻痺状態を管理する
 * 「噛まれた瞬間から次ラウンドのアクションフェイズ終了まで」行動不能
 */
(function () {
  const Paralysis = {
    // { playerIdx: 麻痺が発動するラウンド番号 }
    states: {},

    /**
     * 麻痺を付与する
     * @param {number} playerIdx
     * @param {number} currentRound 噛まれたラウンド
     */
    inflict: function (playerIdx, currentRound) {
      // 次のラウンドのアクションフェイズを丸ごとスキップ
      this.states[playerIdx] = currentRound + 1;
    },

    /**
     * 対象プレイヤーが currentRound に麻痺しているか
     * @param {number} playerIdx
     * @param {number} currentRound
     * @returns {boolean}
     */
    isParalyzed: function (playerIdx, currentRound) {
      return (this.states[playerIdx] || 0) === currentRound;
    },

    reset: function () {
      this.states = {};
    },
  };

  window.Paralysis = Paralysis;
})();
