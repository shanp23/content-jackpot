'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jackpotFormSchema, type JackpotFormData } from '@/lib/validations/jackpot';

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
];

export default function CreateJackpotPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<JackpotFormData>({
    // Relax typing to avoid zod version type incompatibility in tooling
    resolver: zodResolver(jackpotFormSchema as any),
    defaultValues: {
      contentRewardsCampaignUrl: '',
      campaignName: '',
      jackpotBudget: 1000,
      currency: 'USD',
      rewardRatePer1k: 3,
      payoutMode: 'INSTANT' as any,
      startDate: '',
      endDate: '',
      platforms: {
        tiktok: true,
        instagram: true,
        youtube: false,
        twitter: false,
      },
      contentRequirements: '',
      guidelinesLink: '',
      eligibility: 'PUBLIC' as any,
      autoLicenseOnApproval: true,
      baseDanger: { bottomPercentile: 25, stripPercentage: 50 } as any,
      progressiveEnabled: false as any,
      dangerZonePhases: [],
    }
  });

  type DZMode = 'off' | 'mild' | 'standard' | 'aggressive' | 'custom';
  const [dzMode, setDzMode] = useState<DZMode>('off');

  const PRESETS: Record<Exclude<DZMode, 'off' | 'custom'>, { usagePercent: number; stripPercentile: number; stripPercentage: number }[]> = {
    mild: [
      { usagePercent: 50, stripPercentile: 20, stripPercentage: 20 },
    ],
    standard: [
      { usagePercent: 25, stripPercentile: 25, stripPercentage: 40 },
      { usagePercent: 50, stripPercentile: 30, stripPercentage: 50 },
    ],
    aggressive: [
      { usagePercent: 25, stripPercentile: 30, stripPercentage: 50 },
      { usagePercent: 50, stripPercentile: 35, stripPercentage: 60 },
      { usagePercent: 75, stripPercentile: 40, stripPercentage: 70 },
    ],
  };

  function applyPreset(mode: DZMode) {
    setDzMode(mode);
    if (mode === 'off') {
      setValue('dangerZonePhases', [] as any, { shouldDirty: true });
      return;
    }
    if (mode === 'custom') {
      // Initialize with one phase at 25% usage
      setValue('dangerZonePhases', [
        { usagePercent: 25, stripPercentile: 25, stripPercentage: 50 },
      ] as any, { shouldDirty: true });
      return;
    }
    setValue('dangerZonePhases', PRESETS[mode] as any, { shouldDirty: true });
  }

  const onSubmit = async (data: JackpotFormData) => {
    try {
      // Clean danger zone phases: keep only valid rows
      const cleaned = (data.dangerZonePhases || []).filter((p) =>
        p && typeof (p as any).usagePercent === 'number' && (p as any).usagePercent > 0 &&
        typeof (p as any).stripPercentile === 'number' && typeof (p as any).stripPercentage === 'number'
      ).map((p: any) => ({
        usagePercent: Number(p.usagePercent),
        stripPercentile: Number(p.stripPercentile),
        stripPercentage: Number(p.stripPercentage),
      }));
      data.dangerZonePhases = cleaned as any;

      const response = await fetch('/api/jackpots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        // Persist jackpot locally for dashboard tabs (Active/Completed)
        const nowIso = new Date().toISOString();
        const jackpot = result?.jackpot ?? {
          id: 'local_' + Date.now(),
          ...data,
          createdAt: nowIso,
        };

        const start = new Date(jackpot.startDate);
        const end = new Date(jackpot.endDate);
        const now = new Date();
        const status = now < end ? 'ACTIVE' : 'COMPLETED';

        const jackpotToSave = {
          ...jackpot,
          status,
          views: 0,
          submissions: 0,
          lastUpdated: nowIso,
        } as any;

        try {
          const existing = JSON.parse(localStorage.getItem('jackpots') || '[]');
          const updated = Array.isArray(existing) ? existing : [];
          updated.push(jackpotToSave);
          localStorage.setItem('jackpots', JSON.stringify(updated));
        } catch (_) {
          localStorage.setItem('jackpots', JSON.stringify([jackpotToSave]));
        }

        // Redirect to dashboard to show in Active tab
        window.location.href = '/';
      } else {
        throw new Error('Failed to create jackpot');
      }
    } catch (error) {
      alert('Error creating jackpot. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-6">
      <div className="card w-full max-w-2xl p-6">
        <h1 className="text-xl font-semibold text-app mb-6">Create Content Jackpot</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="label">Campaign Name * <span className="tooltip" title="Public title creators will see when browsing.">?</span></label>
            <input
              type="text"
              placeholder="My Awesome Jackpot Campaign"
              className="input w-full"
              {...register('campaignName')}
            />
            {errors.campaignName && (
              <p className="text-sm text-red-500 mt-1">{errors.campaignName.message}</p>
            )}
          </div>

          {/* Campaign URL */}
          <div>
            <label className="label">Content Rewards Campaign URL * <span className="tooltip" title="Link to your Content Rewards campaign on Whop.">?</span></label>
            <input
              type="url"
              placeholder="https://your-content-rewards-campaign.com"
              className="input w-full"
              {...register('contentRewardsCampaignUrl')}
            />
            {errors.contentRewardsCampaignUrl && (
              <p className="text-sm text-red-500 mt-1">{errors.contentRewardsCampaignUrl.message}</p>
            )}
          </div>

          {/* Budget & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Jackpot Budget * <span className="tooltip" title="Maximum amount available for base rewards plus jackpot additions.">?</span></label>
              <input
                type="number"
                placeholder="1000"
                className="input w-full"
                step="0.01"
                min="1"
                {...register('jackpotBudget', { valueAsNumber: true })}
              />
              {errors.jackpotBudget && (
                <p className="text-sm text-red-500 mt-1">{errors.jackpotBudget.message}</p>
              )}
            </div>
            
            <div>
              <label className="label">Currency * <span className="tooltip" title="Currency used for payouts.">?</span></label>
              <select className="dropdown w-full" {...register('currency')}>
                {CURRENCIES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reward rate ($ per 1k views) and payout mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Reward rate ($ per 1,000 views) <span className="tooltip" title="Base pay creators earn for every 1,000 verified views.">?</span></label>
              <input type="number" min={0} step="0.01" className="input w-full" {...register('rewardRatePer1k', { valueAsNumber: true })} />
            </div>
            <div>
              <label className="label">Payout mode <span className="tooltip" title="Instant pays on approval; Batch processes payouts on a cycle.">?</span></label>
              <select className="dropdown w-full" {...register('payoutMode')}>
                <option value="INSTANT">Instant on approval</option>
                <option value="BATCH">Batch/cycle</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date * <span className="tooltip" title="Creators can submit from this date and time.">?</span></label>
              <input
                type="datetime-local"
                className="input w-full"
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>
              )}
            </div>
            
            <div>
              <label className="label">End Date * <span className="tooltip" title="Campaign automatically completes at this time.">?</span></label>
              <input
                type="datetime-local"
                className="input w-full"
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className="label">Supported Platforms * <span className="tooltip" title="Select where creators can post submissions for this campaign.">?</span></label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {[
                { key: 'tiktok', label: 'TikTok' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'youtube', label: 'YouTube' },
                { key: 'twitter', label: 'Twitter/X' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={key}
                    className="w-4 h-4"
                    {...register(`platforms.${key}` as any)}
                  />
                  <label htmlFor={key} className="text-white text-sm">{label}</label>
                </div>
              ))}
            </div>
            {errors.platforms && (
              <p className="text-sm text-red-500 mt-1">{errors.platforms.message}</p>
            )}
          </div>

          {/* Content Requirements */}
          <div>
            <label className="label">Content Requirements * <span className="tooltip" title="Describe what to post, required tags/hashtags, and any quality guidelines.">?</span></label>
            <textarea
              placeholder="Describe what kind of content you're looking for..."
              className="input w-full h-24"
              {...register('contentRequirements')}
            />
            {errors.contentRequirements && (
              <p className="text-sm text-red-500 mt-1">{errors.contentRequirements.message}</p>
            )}
          </div>

          {/* Guidelines & Eligibility */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Brand guidelines link <span className="tooltip" title="Optional URL to your detailed brand guidelines.">?</span></label>
              <input type="url" placeholder="https://..." className="input w-full" {...register('guidelinesLink')} />
            </div>
            <div>
              <label className="label">Creator discovery <span className="tooltip" title="Public opens to all creators; Customers-only restricts to your buyers.">?</span></label>
              <select className="dropdown w-full" {...register('eligibility')}>
                <option value="PUBLIC">Public: open to any creator</option>
                <option value="CUSTOMERS_ONLY">Only existing customers</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" {...register('autoLicenseOnApproval')} />
            <span className="text-sm text-muted">Grant seller a marketing license on approval <span className="tooltip" title="Upon approval, you can reuse the content for marketing.">?</span></span>
          </div>

          {/* Danger Zone Settings (required base + optional progressive) */}
          <div>
            <label className="label">Danger Zone <span className="tooltip" title="Creators in the bottom percentile contribute part of their earnings to the jackpot.">?</span></label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-2">
              <div>
                <p className="text-xs text-muted mb-1">Base (required)</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-muted">Bottom % <span className="tooltip" title="Percent of lowest performers considered in danger.">?</span></label>
                    <input type="number" min={1} max={100} className="input w-full" {...register('baseDanger.bottomPercentile', { valueAsNumber: true })} required />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted">Strip % <span className="tooltip" title="Percent of base earnings taken from bottom group.">?</span></label>
                    <input type="number" min={1} max={100} className="input w-full" {...register('baseDanger.stripPercentage', { valueAsNumber: true })} required />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-muted mb-1">Progressive (optional)</p>
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" id="progressiveEnabled" className="w-4 h-4" {...register('progressiveEnabled')} />
                  <label htmlFor="progressiveEnabled" className="text-sm text-muted">Enable progressive danger zone phases <span className="tooltip" title="Use budget usage thresholds (25%/50%/75%) to tighten rules mid-campaign.">?</span></label>
                </div>
                <select className="dropdown w-full" value={dzMode} onChange={(e) => applyPreset(e.target.value as DZMode)}>
                  <option value="off">Preset: Off</option>
                  <option value="mild">Preset: Mild</option>
                  <option value="standard">Preset: Standard</option>
                  <option value="aggressive">Preset: Aggressive</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            {dzMode !== 'custom' && dzMode !== 'off' && (
              <div className="bg-card border border-subtle rounded p-3 text-sm">
                <div className="text-muted mb-2">Phases</div>
                {(PRESETS[dzMode as Exclude<DZMode, 'off'|'custom'>] || []).map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[12px] mb-1">
                    <span className="px-2 py-0.5 rounded bg-primary/10 border border-subtle text-primary">At {p.usagePercent}% budget used</span>
                    <span className="px-2 py-0.5 rounded bg-card border border-subtle text-muted">Bottom {p.stripPercentile}%</span>
                    <span className="px-2 py-0.5 rounded bg-card border border-subtle text-muted">Strip {p.stripPercentage}%</span>
                  </div>
                ))}
              </div>
            )}

            {dzMode === 'custom' && (
              <div className="mt-2 space-y-2">
                {[0,1,2].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] text-muted">Trigger at budget used <span className="tooltip" title="Threshold of total budget consumed that activates this phase.">?</span></label>
                      <select className="dropdown w-full" onChange={(e) => setValue(`dangerZonePhases.${i}.usagePercent` as any, Number(e.target.value), { shouldDirty: true })}>
                        {[10,25,50,75,90].map(v => (<option key={v} value={v}>{v}%</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-muted">Bottom Percentile <span className="tooltip" title="Who is considered bottom at this phase.">?</span></label>
                      <select className="dropdown w-full" onChange={(e) => setValue(`dangerZonePhases.${i}.stripPercentile` as any, Number(e.target.value), { shouldDirty: true })}>
                        {[10,15,20,25,30,35,40,50].map(v => (<option key={v} value={v}>{v}%</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-muted">Strip Amount <span className="tooltip" title="Percent of base earnings taken from bottom for the jackpot.">?</span></label>
                      <select className="dropdown w-full" onChange={(e) => setValue(`dangerZonePhases.${i}.stripPercentage` as any, Number(e.target.value), { shouldDirty: true })}>
                        {[10,20,30,40,50,60,70,80].map(v => (<option key={v} value={v}>{v}%</option>))}
                      </select>
                    </div>
                  </div>
                ))}
                {errors.dangerZonePhases && (
                  <p className="text-sm text-red-500 mt-1">Invalid danger zone configuration.</p>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="continue-button w-full"
          >
            {isSubmitting ? 'Creating...' : 'Create Jackpot'}
          </button>
        </form>
      </div>
    </div>
  );
}