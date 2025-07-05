export * from './types';
export * from './brandingIdentity';
export * from './socialMediaDesign';
export * from './motionGraphics';
export * from './marketingStrategy';
export * from './namingBrandVoice';
export * from './copywriting';
export * from './illustrationDesign';
export * from './customProject';
export * from './uiUxDesign';

import { Service } from './types';
import { brandingIdentity } from './brandingIdentity';
import { socialMediaDesign } from './socialMediaDesign';
import { motionGraphics } from './motionGraphics';
import { marketingStrategy } from './marketingStrategy';
import { namingBrandVoice } from './namingBrandVoice';
import { copywriting } from './copywriting';
import { illustrationDesign } from './illustrationDesign';
import { customProject } from './customProject';
import { uiUxDesign } from './uiUxDesign';

export const servicesMap: Record<string, Service> = {
  branding_identity: brandingIdentity,
  social_media_design: socialMediaDesign,
  motion_graphics: motionGraphics,
  marketing_strategy: marketingStrategy,
  naming_brand_voice: namingBrandVoice,
  copywriting: copywriting,
  illustration_design: illustrationDesign,
  custom_project: customProject,
  ui_ux_design: uiUxDesign
}; 