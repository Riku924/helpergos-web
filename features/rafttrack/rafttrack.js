/**
 * features/rafttrack/rafttrack.js
 * いかだトラック: 6マス進むごとにいかだ1枚完成
 * 余剰分は次のいかだへ繰り越す
 */
(function () {
  const RaftTrack = {
    position: 0,   // 現在のトラック位置 (0〜5)
    completed: 0,  // 完成したいかだの枚数
    GOAL: 6,

    init: function () {
      this.position = 0;
      this.completed = 0;
    },

    /**
     * トラックを n マス進め、完成したいかだの枚数を返す
     * @param {number} n
     * @returns {number} 今回完成した枚数
     */
    advance: function (n) {
      let newCompleted = 0;
      this.position += n;
      while (this.position >= this.GOAL) {
        this.position -= this.GOAL;
        this.completed++;
        newCompleted++;
      }
      return newCompleted;
    },
  };

  window.RaftTrack = RaftTrack;
})();
