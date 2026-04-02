'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ArticleTopic } from '@/lib/data/articles';

type FilterValue = 'all' | ArticleTopic;

interface TopicFilterProps {
  onFilterChange: (filter: FilterValue) => void;
}

const FILTERS: { key: FilterValue; labelKey: string }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'recession-risk', labelKey: 'filterRecessionRisk' },
  { key: 'energy', labelKey: 'filterEnergy' },
  { key: 'supply-chain', labelKey: 'filterSupplyChain' },
  { key: 'technology', labelKey: 'filterTechnology' },
];

export function TopicFilter({ onFilterChange }: TopicFilterProps) {
  const t = useTranslations('analysis');
  const [active, setActive] = useState<FilterValue>('all');

  function handleClick(key: FilterValue) {
    setActive(key);
    onFilterChange(key);
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {FILTERS.map(({ key, labelKey }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => handleClick(key)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: `1px solid ${isActive ? 'rgba(41,121,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
              background: isActive ? 'rgba(41,121,255,0.15)' : 'rgba(255,255,255,0.04)',
              color: isActive ? '#2979FF' : 'rgba(255,255,255,0.6)',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-body)',
            }}
          >
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}

export type { FilterValue };
