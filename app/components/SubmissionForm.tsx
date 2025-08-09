'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from './ui/FormInput';
import FormSelect from './ui/FormSelect';
import { PlusIcon, ExternalLinkIcon } from 'lucide-react';

const submissionSchema = z.object({
  contentUrl: z.string().url('Must be a valid URL'),
  platform: z.enum(['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'TWITTER'], {
    required_error: 'Platform is required',
  }),
  viewsCount: z.number().min(0, 'Views count cannot be negative').optional().default(0)
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface SubmissionFormProps {
  jackpotId: string;
  userId: string;
  userName: string;
  onSuccess?: () => void;
}

const PLATFORMS = [
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'TWITTER', label: 'Twitter/X' },
];

export default function SubmissionForm({ jackpotId, userId, userName, onSuccess }: SubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jackpotId,
          userId,
          userName,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit content');
      }

      const result = await response.json();
      
      if (result.success) {
        alert('Content submitted successfully!');
        reset();
        setShowForm(false);
        onSuccess?.();
      } else {
        throw new Error(result.error || 'Failed to submit content');
      }
    } catch (error) {
      console.error('Error submitting content:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="btn btn-primary w-full"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Submit Your Content
      </button>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Submit Your Content</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Content URL"
          name="contentUrl"
          type="url"
          placeholder="https://tiktok.com/@yourhandle/video/123"
          required
          tooltip="Link to your content on the platform"
          error={errors.contentUrl?.message}
          {...register('contentUrl')}
        />

        <FormSelect
          label="Platform"
          name="platform"
          options={PLATFORMS}
          placeholder="Select platform"
          required
          tooltip="Which platform is your content on?"
          error={errors.platform?.message}
          {...register('platform')}
        />

        <FormInput
          label="Current Views"
          name="viewsCount"
          type="number"
          placeholder="0"
          tooltip="Current view count (can be updated later)"
          error={errors.viewsCount?.message}
          min="0"
          {...register('viewsCount', { valueAsNumber: true })}
        />

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              reset();
            }}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-success flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Content'}
          </button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
        <div className="flex items-start space-x-2">
          <ExternalLinkIcon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <strong>Tip:</strong> Make sure your content follows the campaign requirements and uses the specified hashtags for maximum visibility.
          </div>
        </div>
      </div>
    </div>
  );
}
