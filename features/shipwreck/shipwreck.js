/**
 * features/shipwreck/shipwreck.js
 * 難破船カードデッキ管理: 山札の構築・シャッフル・1枚引き
 * count フィールドで同一カードの枚数を指定する
 */
(function () {
  const Shipwreck = {
    deck: [],

    /**
     * カード種別定義
     * count: デッキに入れる枚数（省略時は1）
     * type : 'instant'=即時効果 / 'voting'=投票時効果 / 'special'=特殊 / undefined=未定義
     * effect / amount : 効果の種類と量（未定義カードは省略）
     */
    CARD_TYPES: [
      // ── 効果定義済み ──────────────────────────────
      { id: 'water_bottle', name: '水ボトル',     type: 'instant', effect: 'water',        amount: 1, count: 7 },
      { id: 'sandwich',    name: 'サンドウィッチ', type: 'instant', effect: 'food',         amount: 1, count: 7 },
      { id: 'wood_plank',  name: '木の板',        type: 'instant', effect: 'raft_complete',  amount: 1, count: 1 },
      { id: 'food_mill',    name: 'フードミル',      type: 'instant', effect: 'convert',       from: 'food', fromAmount: 2, to: 'water', toAmount: 2, count: 1 },
      { id: 'fruit_basket', name: 'フルーツバスケット',    type: 'special',    effect: 'round_sustain',   count: 1 },
      { id: 'bbq_set',      name: '人肉バーベキューセット', type: 'round_end', effect: 'food_from_deaths', count: 1 },
      { id: 'coconut',      name: 'ココナッツの実',       type: 'instant',   effect: 'water', amount: 3, count: 1 },
      { id: 'sardine_can',  name: 'いわしの缶詰',         type: 'instant',   effect: 'food',               amount: 3, count: 1 },
      { id: 'muddy_water',  name: '濁った水',             type: 'instant',   effect: 'water_with_paralysis', amount: 1, count: 1 },
      { id: 'rotten_fish',  name: '腐った魚',             type: 'instant',   effect: 'food_with_paralysis',  amount: 1, count: 1 },
      { id: 'matchbox',      name: 'マッチ箱',   type: 'modifier', effect: 'purify', targets: ['muddy_water', 'rotten_fish'], count: 1 },
      { id: 'sleeping_pill', name: '睡眠薬',    type: 'special',   effect: 'steal',    maxTargets: 3, faceDown: true, count: 1 },
      { id: 'gun',           name: '銃',        type: 'equipment', effect: 'eliminate', requires: 'bullet', count: 3 },
      { id: 'bullet',        name: '弾丸',        type: 'ammo',    effect: 'fire',           requires: 'gun', count: 6 },
      { id: 'alarm_clock',   name: '目覚まし時計', type: 'special', effect: 'set_next_leader',                count: 1 },
      { id: 'pocket_watch',  name: '懐中時計',    type: 'special',   effect: 'peek_deck',    peekCount: 3,                          count: 1 },
      { id: 'pendulum',      name: '振り子',      type: 'reaction',  effect: 'force_action',   timing: 'before_action', targets: 'other',   count: 1 },
      { id: 'antidote',      name: '抗毒血清',    type: 'reaction',  effect: 'negate_paralysis', timing: 'on_snake_bite', tradeoff: 'lose_bonus_wood', count: 1 },
      { id: 'fishing_rod',   name: '釣竿',        type: 'equipment', effect: 'fish_twice',                                                                 count: 1 },
      { id: 'conch_shell',   name: 'ほら貝',       type: 'reaction',  effect: 'vote_immunity',  timing: 'on_vote', revote: true,   count: 1 },
      { id: 'barometer',     name: '気圧計',       type: 'special',   effect: 'peek_weather',  peekCount: 2,          count: 1 },
      { id: 'club',          name: '棍棒',         type: 'equipment', effect: 'double_vote',                                    count: 1 },
      { id: 'voodoo_doll',   name: 'まじない人形', type: 'special',   effect: 'revive',     timing: 'round_start', count: 1 },
      { id: 'telescope',     name: '望遠鏡',       type: 'special',   effect: 'peek_hand',   targets: 'other', count: 1 },
      { id: 'coffee',        name: 'コーヒー',     type: 'instant',   effect: 'extra_action',  count: 1 },
      { id: 'canteen',       name: '水筒',         type: 'equipment', effect: 'water_twice',    count: 1 },
      { id: 'crystal_ball',  name: '水晶玉',       type: 'equipment', effect: 'vote_last',       count: 1 },
      { id: 'iron_sheet',    name: 'トタン板',     type: 'reaction',  effect: 'block_bullet',     timing: 'on_shot', count: 2 },
      { id: 'axe',           name: '斧',           type: 'equipment', effect: 'logging_boost', guaranteedWood: 2, count: 1 },
      { id: 'ragged_pants',  name: 'ボロのパンツ',          type: 'useless', effect: 'none', count: 1 },
      { id: 'corridoor',     name: 'ボードゲーム「コリドール」', type: 'useless', effect: 'none', count: 1 },
      { id: 'luxury_car_key',  name: '高級車の鍵',       type: 'useless', effect: 'none', count: 1 },
      { id: 'lottery_ticket',  name: '宝くじの当選券',     type: 'useless', effect: 'none', count: 1 },
      { id: 'toilet_brush',   name: 'トイレ清掃ブラシ', type: 'useless', effect: 'none', count: 1 },

    ],

    /** CARD_TYPES から枚数を展開してデッキを構築する */
    _buildDeck: function () {
      const deck = [];
      this.CARD_TYPES.forEach(function (card) {
        const n = card.count || 1;
        for (let i = 0; i < n; i++) {
          deck.push({
            id: card.id, name: card.name,
            type: card.type, effect: card.effect, amount: card.amount,
          });
        }
      });
      return deck;
    },

    init: function () {
      this.deck = this._buildDeck();
      this._shuffle();
    },

    /** 山札の一番上から1枚引く。山札切れなら再構築してシャッフル */
    draw: function () {
      if (this.deck.length === 0) {
        this.deck = this._buildDeck();
        this._shuffle();
      }
      return this.deck.pop();
    },

    remaining: function () {
      return this.deck.length;
    },

    /** 山札の上からn枚の中身を確認する（デッキは変更しない） */
    peekTop: function (n) {
      const len = this.deck.length;
      return this.deck.slice(Math.max(0, len - n), len).reverse();
    },

    /**
     * 初期配布: 各プレイヤーに cardsPerPlayer 枚ずつ配り、手札カード配列の配列を返す
     * 配った分はデッキから除かれる（残りが船あさりの山札になる）
     * @param {number} numPlayers
     * @param {number} cardsPerPlayer  3〜8人=4枚 / 9〜12人=3枚
     * @returns {Array[]} 各プレイヤーの初期手札カード配列
     */
    dealInitial: function (numPlayers, cardsPerPlayer) {
      const hands = [];
      for (let i = 0; i < numPlayers; i++) {
        const hand = [];
        for (let j = 0; j < cardsPerPlayer && this.deck.length > 0; j++) {
          hand.push(this.deck.pop());
        }
        hands.push(hand);
      }
      return hands;
    },

    /** 人数に応じた初期配布枚数を返す */
    initialCardsPerPlayer: function (numPlayers) {
      return numPlayers <= 8 ? 4 : 3;
    },

    _shuffle: function () {
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    },
  };

  window.Shipwreck = Shipwreck;
})();
