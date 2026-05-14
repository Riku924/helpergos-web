/**
 * features/raft/raft.js
 * 伐採アクション: ランダムでいかだ材料 1〜2 を取得
 */
(function () {
  const RaftAction = {
    /**
     * 伐採を実行し、取得したいかだ材料の量を返す
     * @returns {number} 1〜2
     */
    cut: function () {
      return Math.floor(Math.random() * 2) + 1;
    },
  };

  window.RaftAction = RaftAction;
})();
