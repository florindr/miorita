// src/components/tutorWidgets/index.ts — Unified Tutor Widget Mount & Factory

import type { AnyTutorWidgetConfig, TutorWidgetResult } from './widgetTypes';
import { WordMorphSliderWidget } from './wordMorphSlider';
import { CalqueZapperWidget } from './calqueZapper';
import { BridgeTileSnapWidget } from './bridgeTileSnap';
import { RoleReversalDetectorWidget } from './roleReversalDetector';
import { GenderBasketMiniWidget } from './genderBasketMini';
import { CheckpointTrailWidget } from './checkpointTrailWidget';

export * from './widgetTypes';
export {
  WordMorphSliderWidget,
  CalqueZapperWidget,
  BridgeTileSnapWidget,
  RoleReversalDetectorWidget,
  GenderBasketMiniWidget,
  CheckpointTrailWidget,
};

export function mountTutorWidget(
  container: HTMLElement,
  config: AnyTutorWidgetConfig,
  onComplete?: (result: TutorWidgetResult) => void
): unknown {
  switch (config.type) {
    case 'WordMorphSlider':
      return new WordMorphSliderWidget(container, config, onComplete);
    case 'CalqueZapper':
      return new CalqueZapperWidget(container, config, onComplete);
    case 'BridgeTileSnap':
      return new BridgeTileSnapWidget(container, config, onComplete);
    case 'RoleReversalDetector':
      return new RoleReversalDetectorWidget(container, config, onComplete);
    case 'GenderBasketMini':
      return new GenderBasketMiniWidget(container, config, onComplete);
    case 'CheckpointTrailWidget':
      return new CheckpointTrailWidget(container, config);
  }
}

