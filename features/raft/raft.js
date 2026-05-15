/**
 * features/raft/raft.js
 * 伐採アクションの定数定義
 * ロジック本体は SnakeBag / RaftTrack / Paralysis と連携して index.html で処理する
 */
(function () {
  const RaftAction = {
    GUARANTEED: 1,   // 森の入り口で必ず確保できる木材（1本）
    MAX_DEEPER: 5,   // 奥に進むとき宣言できる最大本数
  };

  window.RaftAction = RaftAction;
})();
