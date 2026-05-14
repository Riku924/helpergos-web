/**
 * features/food/food.js
 * 釣りアクション: ランダムで食料 1〜3 を取得
 */
(function () {
  const FoodAction = {
    /**
     * 釣りを実行し、取得した食料の量を返す
     * @returns {number} 1〜3
     */
    fish: function () {
      return Math.floor(Math.random() * 3) + 1;
    },
  };

  window.FoodAction = FoodAction;
})();
