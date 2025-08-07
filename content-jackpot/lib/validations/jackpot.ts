import { z } from 'zod';

export const jackpotFormSchema = z.object({
  // Basic Info
  contentRewardsCampaignUrl: z.string().min(1, 'Content Rewards campaign URL is required').url('Must be a valid URL'),
  campaignName: z.string().min(1, 'Campaign name is required').max(100, 'Campaign name must be less than 100 characters'),
  type: z.enum(['UGC', 'PROMOTIONAL', 'EDUCATIONAL'], {
    required_error: 'Campaign type is required',
  }),
  category: z.string().min(1, 'Category is required'),
  thumbnailUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),

  // Budget & Rewards
  jackpotBudget: z.number().min(1, 'Jackpot budget must be at least $1'),
  currency: z.enum(['USD', 'EUR', 'GBP'], {
    required_error: 'Currency is required',
  }),
  rewardRate: z.number().min(0.01, 'Reward rate must be at least $0.01 per 1000 views'),
  minimumPayout: z.number().min(0, 'Minimum payout cannot be negative'),
  maximumPayout: z.number().min(1, 'Maximum payout must be at least $1'),
  flatFeeBonus: z.number().min(0, 'Flat fee bonus cannot be negative').optional(),

  // Danger Zone Settings
  dangerZoneEnabled: z.boolean(),
  stripPercentage: z.number().min(1, 'Strip percentage must be at least 1%').max(50, 'Strip percentage cannot exceed 50%'),
  stripType: z.enum(['FULL', 'PARTIAL', 'PROGRESSIVE'], {
    required_error: 'Strip type is required',
  }),

  // Prize Distribution
  winnersCount: z.number().min(1, 'Must have at least 1 winner').max(10, 'Cannot have more than 10 winners'),
  prizeDistribution: z.object({
    first: z.number().min(1, 'First place must get at least 1%').max(100, 'Cannot exceed 100%'),
    second: z.number().min(0, 'Second place cannot be negative').max(100, 'Cannot exceed 100%').optional(),
    third: z.number().min(0, 'Third place cannot be negative').max(100, 'Cannot exceed 100%').optional(),
    fourth: z.number().min(0, 'Fourth place cannot be negative').max(100, 'Cannot exceed 100%').optional(),
    fifth: z.number().min(0, 'Fifth place cannot be negative').max(100, 'Cannot exceed 100%').optional(),
    sixth: z.number().min(0, 'Sixth place cannot be negative').max(100, 'Cannot exceed 100%').optional(),
    seventh: z.number().min(0, 'Seventh place cannot be negative').max(100, 'Cannot exceed 100%').optional(),
    eighth: z.number().min(0, 'Eighth place cannot be negative').max(100, 'Cannot exceed 100%').optional(),
    ninth: z.number().min(0, 'Ninth place cannot be negative').max(100, 'Cannot exceed 100%').optional(),
    tenth: z.number().min(0, 'Tenth place cannot be negative').max(100, 'Cannot exceed 100%').optional(),
  }),

  // Timeline
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  maxExtensions: z.number().min(0, 'Max extensions cannot be negative').max(5, 'Cannot have more than 5 extensions'),

  // Platforms
  platforms: z.object({
    tiktok: z.boolean(),
    instagram: z.boolean(),
    youtube: z.boolean(),
    twitter: z.boolean(),
  }).refine((data) => Object.values(data).some(Boolean), {
    message: 'At least one platform must be selected',
  }),

  // Content Requirements
  contentRequirements: z.string().min(10, 'Content requirements must be at least 10 characters').max(1000, 'Content requirements must be less than 1000 characters'),
  availableContent: z.string().url('Must be a valid Google Drive URL').optional().or(z.literal('')),
}).refine((data) => {
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => {
  return data.maximumPayout > data.minimumPayout;
}, {
  message: 'Maximum payout must be greater than minimum payout',
  path: ['maximumPayout'],
}).refine((data) => {
  // Validate that prize distribution adds up to 100%
  const distribution = data.prizeDistribution;
  const values = Object.values(distribution).filter((val): val is number => val !== undefined);
  const total = values.reduce((sum, val) => sum + val, 0);
  return Math.abs(total - 100) < 0.01; // Allow for floating point precision
}, {
  message: 'Prize distribution must add up to 100%',
  path: ['prizeDistribution'],
});

export type JackpotFormData = z.infer<typeof jackpotFormSchema>;
