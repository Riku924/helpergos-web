/**
 * features/water/water.js
 * 水汲みアクション: 天候カードの雨量がそのまま取得量になる
 * 依存: Weather (weather.js)
 */
(function () {
  const WaterAction = {
    /**
     * 水汲みを実行し、取得した水の量を返す
     * @returns {number} Weather.current の値 (0〜3)
     */
    collect: function () {
      return Weather.current !== null ? Weather.current : 0;
    },
  };

  window.WaterAction = WaterAction;
})();
