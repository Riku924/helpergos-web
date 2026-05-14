/**
 * features/leader/leader.js
 * リーダー管理: ランダム初期選出・ラウンドごとのローテーション
 */
(function () {
  const Leader = {
    current: 0,   // リーダーのプレイヤーインデックス
    numPlayers: 3,

    /** ゲーム開始時にランダムでリーダーを選ぶ */
    init: function (numPlayers) {
      this.numPlayers = numPlayers;
      this.current = Math.floor(Math.random() * numPlayers);
    },

    /** ラウンド終了後に次のプレイヤーへ */
    rotate: function () {
      this.current = (this.current + 1) % this.numPlayers;
    },

    name: function () {
      return 'プレイヤー' + (this.current + 1);
    },

    /**
     * ラウンド内のターン順を返す（リーダーから始まる）
     * 例: leader=1, numPlayers=3 → [1, 2, 0]
     */
    turnOrder: function () {
      const order = [];
      for (let i = 0; i < this.numPlayers; i++) {
        order.push((this.current + i) % this.numPlayers);
      }
      return order;
    },
  };

  window.Leader = Leader;
})();
