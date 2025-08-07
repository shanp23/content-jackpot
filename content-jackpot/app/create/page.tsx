'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jackpotFormSchema, type JackpotFormData } from '@/lib/validations/jackpot';
import FormInput from '@/app/components/ui/FormInput';
import FormSelect from '@/app/components/ui/FormSelect';
import FormCheckbox from '@/app/components/ui/FormCheckbox';
import { TrophyIcon, DollarSignIcon, CalendarIcon, SettingsIcon, AlertTriangleIcon } from 'lucide-react';

const CAMPAIGN_TYPES = [
  { value: 'UGC', label: 'User Generated Content' },
  { value: 'PROMOTIONAL', label: 'Promotional' },
  { value: 'EDUCATIONAL', label: 'Educational' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
];

const CATEGORIES = [
  { value: 'Personal brand', label: 'Personal Brand' },
  { value: 'Business', label: 'Business' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Education', label: 'Education' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Food', label: 'Food & Cooking' },
  { value: 'Travel', label: 'Travel' },
];

const STRIP_TYPES = [
  { value: 'FULL', label: 'Full Strip (100% of earnings)' },
  { value: 'PARTIAL', label: 'Partial Strip (Fixed percentage)' },
  { value: 'PROGRESSIVE', label: 'Progressive (More for worse performers)' },
];

export default function CreateJackpotPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<JackpotFormData>({
    resolver: zodResolver(jackpotFormSchema),
    defaultValues: {
      contentRewardsCampaignUrl: '',
      campaignName: '',
      type: 'UGC',
      category: 'Personal brand',
      thumbnailUrl: '',
      jackpotBudget: 1000,
      currency: 'USD',
      rewardRate: 2.50,
      minimumPayout: 5.00,
      maximumPayout: 500.00,
      flatFeeBonus: 0,
      dangerZoneEnabled: false,
      stripPercentage: 25,
      stripType: 'PARTIAL',
      winnersCount: 3,
      prizeDistribution: {
        first: 60,
        second: 30,
        third: 10,
      },
      startDate: '',
      endDate: '',
      maxExtensions: 3,
      platforms: {
        tiktok: true,
        instagram: true,
        youtube: false,
        twitter: false,
      },
      contentRequirements: '',
      availableContent: '',
    }
  });

  const watchedValues = watch();
  const dangerZoneEnabled = watch('dangerZoneEnabled');
  const winnersCount = watch('winnersCount');

  const onSubmit = async (data: JackpotFormData) => {
    console.log('Form submitted with data:', data);
    
    try {
      // The data already contains the values from the form
      // For date inputs, they come as strings, so we keep them as strings for now
      const submissionData = {
        ...data,
        // Keep dates as strings since our validation now expects strings
      };

      console.log('Sending to API:', submissionData);

      const response = await fetch('/api/jackpots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }
      
      if (result.success) {
        alert(`🎉 Jackpot "${data.campaignName}" created successfully!\n\nRedirecting to your new jackpot...`);
        // Redirect to the new jackpot page
        window.location.href = `/jackpots/${result.jackpot.id}`;
      } else {
        throw new Error(result.error || 'Failed to create jackpot');
      }
    } catch (error) {
      console.error('Error creating jackpot:', error);
      alert(`❌ Error creating jackpot:\n\n${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-[1400px] bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT PANEL - Form (60%) */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-[18px] font-semibold text-white mb-2">Create Content Jackpot</h1>
              <p className="text-[#9ca3af] text-sm">Add a competitive layer to your Content Rewards campaign</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Content Rewards Campaign URL */}
              <div className="space-y-2">
                <label className="label">
                  Content Rewards Campaign URL
                  <span className="required">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://your-content-rewards-campaign.com"
                  className="input w-full"
                  {...register('contentRewardsCampaignUrl')}
                />
                {errors.contentRewardsCampaignUrl && (
                  <p className="text-sm text-red-500">{errors.contentRewardsCampaignUrl.message}</p>
                )}
              </div>

              {/* Campaign Name */}
              <div className="space-y-2">
                <label className="label">
                  Campaign Name
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="My Awesome Jackpot Campaign"
                  className="input w-full"
                  {...register('campaignName')}
                />
                {errors.campaignName && (
                  <p className="text-sm text-red-500">{errors.campaignName.message}</p>
                )}
              </div>

              {/* Campaign Type */}
              <div className="space-y-2">
                <label className="label">
                  Campaign Type
                  <span className="required">*</span>
                </label>
                <select className="dropdown w-full" {...register('type')}>
                  {CAMPAIGN_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="label">
                  Category
                  <span className="required">*</span>
                </label>
                <select className="dropdown w-full" {...register('category')}>
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              {/* Jackpot Budget */}
              <div className="space-y-2">
                <label className="label">
                  Jackpot Budget
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  className="input w-full"
                  step="0.01"
                  min="1"
                  {...register('jackpotBudget', { valueAsNumber: true })}
                />
                {errors.jackpotBudget && (
                  <p className="text-sm text-red-500">{errors.jackpotBudget.message}</p>
                )}
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <label className="label">
                  Currency
                  <span className="required">*</span>
                </label>
                <select className="dropdown w-full" {...register('currency')}>
                  {CURRENCIES.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
                {errors.currency && (
                  <p className="text-sm text-red-500">{errors.currency.message}</p>
                )}
              </div>

              {/* Base Reward Rate */}
              <div className="space-y-2">
                <label className="label">
                  Base Reward Rate (per 1K views)
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  placeholder="2.50"
                  className="input w-full"
                  step="0.01"
                  min="0.01"
                  {...register('rewardRate', { valueAsNumber: true })}
                />
                {errors.rewardRate && (
                  <p className="text-sm text-red-500">{errors.rewardRate.message}</p>
                )}
              </div>

              {/* Min and Max Payout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label">
                    Minimum Payout
                    <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="5.00"
                    className="input w-full"
                    step="0.01"
                    min="0"
                    {...register('minimumPayout', { valueAsNumber: true })}
                  />
                  {errors.minimumPayout && (
                    <p className="text-sm text-red-500">{errors.minimumPayout.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="label">
                    Maximum Payout
                    <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="500.00"
                    className="input w-full"
                    step="0.01"
                    min="1"
                    {...register('maximumPayout', { valueAsNumber: true })}
                  />
                  {errors.maximumPayout && (
                    <p className="text-sm text-red-500">{errors.maximumPayout.message}</p>
                  )}
                </div>
              </div>

              {/* Start and End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label">
                    Start Date
                    <span className="required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input w-full"
                    {...register('startDate')}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="label">
                    End Date
                    <span className="required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input w-full"
                    {...register('endDate')}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              {/* Winners Count */}
              <div className="space-y-2">
                <label className="label">
                  Number of Winners
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  placeholder="3"
                  className="input w-full"
                  min="1"
                  max="10"
                  {...register('winnersCount', { valueAsNumber: true })}
                />
                {errors.winnersCount && (
                  <p className="text-sm text-red-500">{errors.winnersCount.message}</p>
                )}
              </div>

              {/* Platforms */}
              <div className="space-y-4">
                <label className="label">
                  Supported Platforms
                  <span className="required">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="tiktok"
                      className="w-4 h-4 text-blue-600 bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-blue-500 focus:ring-2"
                      {...register('platforms.tiktok')}
                    />
                    <label htmlFor="tiktok" className="text-white">TikTok</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="instagram"
                      className="w-4 h-4 text-blue-600 bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-blue-500 focus:ring-2"
                      {...register('platforms.instagram')}
                    />
                    <label htmlFor="instagram" className="text-white">Instagram</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="youtube"
                      className="w-4 h-4 text-blue-600 bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-blue-500 focus:ring-2"
                      {...register('platforms.youtube')}
                    />
                    <label htmlFor="youtube" className="text-white">YouTube</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="twitter"
                      className="w-4 h-4 text-blue-600 bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-blue-500 focus:ring-2"
                      {...register('platforms.twitter')}
                    />
                    <label htmlFor="twitter" className="text-white">Twitter/X</label>
                  </div>
                </div>
                {errors.platforms && (
                  <p className="text-sm text-red-500">{errors.platforms.message}</p>
                )}
              </div>

              {/* Content Requirements */}
              <div className="space-y-2">
                <label className="label">
                  Content Requirements
                  <span className="required">*</span>
                </label>
                <textarea
                  placeholder="Describe what kind of content you're looking for, any specific requirements, hashtags to use, etc."
                  className="input w-full"
                  rows={4}
                  {...register('contentRequirements')}
                />
                {errors.contentRequirements && (
                  <p className="text-sm text-red-500">{errors.contentRequirements.message}</p>
                )}
              </div>

              {/* Danger Zone */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dangerZoneEnabled"
                    className="w-4 h-4 text-blue-600 bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-blue-500 focus:ring-2"
                    {...register('dangerZoneEnabled')}
                  />
                  <label htmlFor="dangerZoneEnabled" className="text-white font-medium">
                    Enable Danger Zone
                  </label>
                </div>
                
                {dangerZoneEnabled && (
                  <div className="ml-6 space-y-4">
                    <div className="space-y-2">
                      <label className="label">
                        Strip Percentage
                        <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="25"
                        className="input w-full"
                        min="1"
                        max="50"
                        step="1"
                        {...register('stripPercentage', { valueAsNumber: true })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="label">
                        Strip Type
                        <span className="required">*</span>
                      </label>
                      <select className="dropdown w-full" {...register('stripType')}>
                        {STRIP_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="continue-button"
              >
                {isSubmitting ? 'Creating Jackpot...' : 'Create Jackpot'}
              </button>
            </form>
          </div>

          {/* RIGHT PANEL - Preview (40%) */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
              <h3 className="text-[18px] font-semibold text-white mb-4">Campaign Preview</h3>
              
              <div className="space-y-4">
                {/* Campaign Info Preview */}
                <div className="space-y-2">
                  <h4 className="font-medium text-white">
                    {watchedValues.campaignName || 'Campaign Name'}
                  </h4>
                  <p className="text-sm text-[#9ca3af]">
                    Type: {watchedValues.type || 'UGC'} • Category: {watchedValues.category || 'Personal Brand'}
                  </p>
                </div>

                {/* Budget Preview */}
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4">
                  <div className="text-sm text-[#9ca3af] mb-1">Jackpot Prize Pool</div>
                  <div className="text-2xl font-bold text-[#10b981]">
                    {watchedValues.currency === 'EUR' ? '€' : watchedValues.currency === 'GBP' ? '£' : '$'}
                    {watchedValues.jackpotBudget?.toLocaleString() || '0'}
                  </div>
                </div>

                {/* Reward Rate Preview */}
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4">
                  <div className="text-sm text-[#9ca3af] mb-1">Base Rate per 1K views</div>
                  <div className="text-lg font-semibold text-[#3b82f6]">
                    {watchedValues.currency === 'EUR' ? '€' : watchedValues.currency === 'GBP' ? '£' : '$'}
                    {watchedValues.rewardRate?.toFixed(2) || '0.00'}
                  </div>
                </div>

                {/* Winners Preview */}
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4">
                  <div className="text-sm text-[#9ca3af] mb-1">Winners</div>
                  <div className="text-lg font-semibold text-white">
                    {watchedValues.winnersCount || 3} winners
                  </div>
                </div>

                {/* Danger Zone Preview */}
                {watchedValues.dangerZoneEnabled && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="text-sm text-red-400 mb-1 flex items-center">
                      <AlertTriangleIcon className="w-4 h-4 mr-1" />
                      Danger Zone Active
                    </div>
                    <div className="text-sm text-red-300">
                      Bottom {watchedValues.stripPercentage || 25}% lose earnings
                    </div>
                  </div>
                )}

                {/* Prize Distribution Preview */}
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4">
                  <div className="text-sm text-[#9ca3af] mb-2">Prize Distribution</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white">1st Place</span>
                      <span className="text-[#10b981] font-semibold">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">2nd Place</span>
                      <span className="text-[#10b981] font-semibold">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">3rd Place</span>
                      <span className="text-[#10b981] font-semibold">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
