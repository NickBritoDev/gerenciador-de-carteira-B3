'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PortfolioFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  assetCounts: {
    total: number;
    acoes: number;
    fiis: number;
  };
}

export function PortfolioFilters({ activeFilter, onFilterChange, assetCounts }: PortfolioFiltersProps) {
  const filters = [
    { key: 'all', label: 'Todos', count: assetCounts.total },
    { key: 'Ação', label: 'Ações', count: assetCounts.acoes },
    { key: 'FII', label: 'FIIs', count: assetCounts.fiis },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className={cn(
            "gap-2 transition-all duration-200",
            activeFilter === filter.key && "shadow-lg"
          )}
        >
          {filter.label}
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              activeFilter === filter.key ? "bg-primary-foreground/20" : ""
            )}
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}