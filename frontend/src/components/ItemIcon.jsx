import React from 'react';

export const ITEM_ICONS = {
  topper_gold_star: { icon: '⭐️', anim: 'animate-twinkle scale-125' },
  topper_ice_angel: { icon: '👼', anim: 'animate-float scale-125' },
  ornament_red_bauble: { icon: '🔴', anim: 'animate-sway' },
  ornament_gold_bauble: { icon: '🟡', anim: 'animate-sway' },
  ornament_jingle_bell: { icon: '🔔', anim: 'animate-sway' },
  ornament_candy_cane: { icon: '🍬', anim: 'hover:rotate-12 transition-transform' },
  ornament_gingerbread: { icon: '🍪', anim: 'hover:scale-110 transition-transform' },
  ornament_santa_sock: { icon: '🧦', anim: 'animate-sway' },
  light_fairy_warm: { icon: '✨', anim: 'animate-twinkle text-yellow-300' },
  light_rainbow_flash: { icon: '🌈', anim: 'animate-pulse' },
  gift_red_ribbon: { icon: '🎁', anim: 'animate-bounce' },
  gift_green_mystery: { icon: '🟢', anim: 'animate-pulse' },
};

export default function ItemIcon({ code, category, size = 'text-3xl' }) {
  const itemConfig = ITEM_ICONS[code];
  if (itemConfig) {
    return (
      <span className={`inline-block select-none ${size} ${itemConfig.anim}`}>
        {itemConfig.icon}
      </span>
    );
  }

  // Fallback by category
  switch (category) {
    case 'TOPPER':
      return <span className={`inline-block ${size} animate-twinkle`}>⭐</span>;
    case 'LIGHT':
      return <span className={`inline-block ${size} animate-pulse`}>💡</span>;
    case 'GIFT':
      return <span className={`inline-block ${size}`}>🎁</span>;
    default:
      return <span className={`inline-block ${size}`}>🎀</span>;
  }
}
