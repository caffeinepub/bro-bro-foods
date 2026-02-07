import { useEffect, useRef } from 'react';
import { useAdsConfig } from '@/hooks/useAdsConfig';
import { mountAdSlot, unmountAdSlot } from '@/lib/ads';

interface AdSlotProps {
  /**
   * The name of the ad slot to render
   */
  slotName: 'topBanner' | 'bottomBanner';
  
  /**
   * Optional CSS class name for the container
   */
  className?: string;
}

/**
 * AdSlot Component
 * 
 * Renders a specific ad slot by mounting the configured snippet into a container.
 * If ads are disabled or the slot is not configured, renders nothing.
 * Uses runtime configuration from useAdsConfig hook.
 */
export default function AdSlot({ slotName, className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { adsConfig } = useAdsConfig();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only mount if ads are enabled and slot is configured
    const slotSnippet = adsConfig.slots[slotName];
    if (!adsConfig.enabled || !slotSnippet?.trim()) {
      return;
    }

    // Mount the ad slot snippet
    mountAdSlot(container, slotSnippet);

    // Cleanup on unmount
    return () => {
      unmountAdSlot(container);
    };
  }, [slotName, adsConfig.enabled, adsConfig.slots]);

  // If ads are disabled or slot is not configured, render nothing
  const slotSnippet = adsConfig.slots[slotName];
  if (!adsConfig.enabled || !slotSnippet?.trim()) {
    return null;
  }

  // Render the container for the ad slot
  return (
    <div 
      ref={containerRef} 
      className={className}
      data-ad-slot={slotName}
    />
  );
}
