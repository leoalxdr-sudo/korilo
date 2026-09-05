import type { IconType } from "react-icons";
import {
  SiApple,
  SiAsus,
  SiDell,
  SiLenovo,
  SiAcer,
  SiHp,
  SiSony,
  SiBose,
  SiSennheiser,
  SiJbl,
  SiSamsung,
  SiGoogle,
  SiOneplus,
  SiMotorola,
  SiNike,
  SiAdidas,
} from "react-icons/si";

// Simple Icons doesn't cover every brand in the catalog (mostly niche
// audio/running brands) — ProductImage falls back to a styled-initials
// wordmark for anything not listed here.
export const BRAND_ICONS: Record<string, IconType> = {
  Apple: SiApple,
  ASUS: SiAsus,
  Dell: SiDell,
  Lenovo: SiLenovo,
  Acer: SiAcer,
  HP: SiHp,
  Sony: SiSony,
  Bose: SiBose,
  Sennheiser: SiSennheiser,
  JBL: SiJbl,
  Samsung: SiSamsung,
  Google: SiGoogle,
  OnePlus: SiOneplus,
  Motorola: SiMotorola,
  Nike: SiNike,
  Adidas: SiAdidas,
};
