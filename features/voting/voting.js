/**
 * features/voting/voting.js
 * 投票フェーズの票管理モジュール
 */
(function () {
  const Voting = {
    votes: {}, // { voterIdx: targetIdx }

    reset: function () {
      this.votes = {};
    },

    castVote: function (voterIdx, targetIdx) {
      this.votes[voterIdx] = targetIdx;
    },

    /**
     * 投票集計
     * @param {number[]} alivePlayers  - 生存者インデックス配列
     * @param {number[]} immunePlayers - 免疫プレイヤーインデックス配列
     * @param {number[]} doubleVoters  - 2票扱いプレイヤーインデックス配列
     * @returns {{ eliminated: number|null, tied: boolean, counts: object }}
     */
    tally: function (alivePlayers, immunePlayers, doubleVoters) {
      const counts = {};
      alivePlayers.forEach(function (p) { counts[p] = 0; });

      Object.keys(this.votes).forEach(function (voterStr) {
        const voter  = Number(voterStr);
        const target = Voting.votes[voterStr];
        const weight = doubleVoters.includes(voter) ? 2 : 1;
        if (counts[target] !== undefined) counts[target] += weight;
      });

      const eligible = alivePlayers.filter(function (p) {
        return !immunePlayers.includes(p);
      });

      if (eligible.length === 0) {
        return { eliminated: null, tied: false, counts: counts };
      }

      const maxVotes = Math.max.apply(null, eligible.map(function (p) { return counts[p]; }));
      const top = eligible.filter(function (p) { return counts[p] === maxVotes; });

      if (top.length > 1) {
        return { eliminated: null, tied: true, counts: counts };
      }

      return { eliminated: top[0], tied: false, counts: counts };
    },
  };

  window.Voting = Voting;
})();
