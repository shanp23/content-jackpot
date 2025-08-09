import { z } from 'zod';

export const jackpotFormSchema = z.object({
  // Basic Info
  contentRewardsCampaignUrl: z.string().min(1, 'Content Rewards campaign URL is required').url('Must be a valid URL'),
  campaignName: z.string().min(1, 'Campaign name is required').max(100, 'Campaign name must be less than 100 characters'),
  
  // Budget
  jackpotBudget: z.number().min(1, 'Jackpot budget must be at least $1'),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
  rewardRatePer1k: z.number().min(0).default(0),
  payoutMode: z.enum(['INSTANT', 'BATCH']).default('INSTANT'),
  
  // Timeline
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  
  // Platforms
  platforms: z.object({
    tiktok: z.boolean(),
    instagram: z.boolean(),
    youtube: z.boolean(),
    twitter: z.boolean(),
  }).refine((data) => Object.values(data).some(Boolean), {
    message: 'At least one platform must be selected',
  }),
  
  // Content
  contentRequirements: z.string().min(10, 'Content requirements must be at least 10 characters'),
  guidelinesLink: z.string().url().optional(),
  eligibility: z.enum(['CUSTOMERS_ONLY', 'PUBLIC']).default('PUBLIC'),
  autoLicenseOnApproval: z.boolean().default(true),
  // Required base danger zone (always used). Progressive can override during runtime
  baseDanger: z.object({
    bottomPercentile: z.number().min(1).max(100),
    stripPercentage: z.number().min(1).max(100),
  }),
  progressiveEnabled: z.boolean().default(false),
  // Progressive Danger Zone (optional) - up to 3 phases, budget-usage based
  dangerZonePhases: z
    .array(
      z.object({
        usagePercent: z.number().min(1).max(100), // triggers at this % of budget used
        stripPercentile: z.number().min(1).max(100),
        stripPercentage: z.number().min(1).max(100),
      })
    )
    .max(3)
    .optional(),
}).refine((data) => {
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => {
  // If progressive is enabled, require at least one phase
  if (data.progressiveEnabled) {
    return Array.isArray(data.dangerZonePhases) && data.dangerZonePhases.length > 0;
  }
  return true;
}, {
  message: 'Add at least one progressive danger-zone phase or disable progressive mode',
  path: ['dangerZonePhases']
});

export type JackpotFormData = z.infer<typeof jackpotFormSchema>;