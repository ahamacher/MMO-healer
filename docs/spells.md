heal: { mp: 10, hp: 20, castTime: 1.5s, singleTarget: true, gcd: true, effect: none }
regen: { mp: 15, hp: 5, castTime: 0.0s, singleTarget: true, gcd: true, effect: regen(15s) }
aoeheal: { mp: 30, hp: 15, castTime: 1.5s, singleTarget: false, gcd: true, effect: none }
cleanse: { mp: 5, hp: 0, castTime: .5s, singleTarget: true, gcd: true, effect: debuff-- }
shield: { mp: 10, hp: 0, castTime: 1.5s, singleTarget: true, gcd: true, effect: shield(15) }
shieldall: { mp: 35, hp: 5, castTime: 1.5s, singleTarget: false, gcd: true, effect: shield(10) }
revive: { mp: 40, hp: 20, castTime: 3.5s, singleTarget: true, gcd: true, effect: shield(15) }
aoehot: { mp: 35, hp: 5, castTime: 1.5s, singleTarget: false, gcd: true, effect: regenII(15s) }
manaRefresh: { mp: 0, hp: 0, castTime: 0s, signleTarget: false, gcd: false, effect: mpRegen(15s)}
burst { mp: 0, hp: 15, castTime: 0s, singleTarget: true, gcd: false, effect: none }
ohshit { mp: 0, hp: 15, castTime: 0s, singleTarget: true, gcd: false, effect: heal(25%) }


npc stats:
tank( hp: 200, attack: 4, attackRate: 1.8s )
dps( hp: 100, attack: 8, attackRate: 1.5s )
healer( hp: 100, attack: 3, heal: 5, healRate: 1.8s )
