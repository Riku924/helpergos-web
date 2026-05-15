/**
 * features/snake/snake.js
 * 毒蛇の玉袋: 白7・黒3 の計10個
 * 指定した数だけ引き、黒が含まれていたら噛まれたと判定する
 */
(function () {
  const SnakeBag = {
    WHITE: 7,
    BLACK: 3,

    /**
     * n個の玉を引く（引いた後は必ず戻す前提なので毎回全袋から）
     * @param {number} n 引く個数 (1〜5)
     * @returns {{ bitten: boolean, drawn: Array<'white'|'black'> }}
     */
    draw: function (n) {
      const bag = [];
      for (let i = 0; i < this.WHITE; i++) bag.push('white');
      for (let i = 0; i < this.BLACK; i++) bag.push('black');

      // Fisher-Yates シャッフル
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }

      const drawn = bag.slice(0, n);
      return { bitten: drawn.includes('black'), drawn };
    },

    /**
     * n本宣言したときに噛まれない確率 (%) を返す
     * 超幾何分布: C(7,n) / C(10,n)
     */
    safePercent: function (n) {
      const total = this.WHITE + this.BLACK;
      let num = 1, den = 1;
      for (let i = 0; i < n; i++) {
        num *= (this.WHITE - i);
        den *= (total - i);
      }
      return Math.round((num / den) * 100);
    },
  };

  window.SnakeBag = SnakeBag;
})();
