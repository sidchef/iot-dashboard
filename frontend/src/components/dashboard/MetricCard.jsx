import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info'
  onClick,
}) {
  const variantStyles = {
    default: {
      iconBg: 'bg-slate-100 text-slate-700',
      borderHover: 'hover:border-slate-300',
    },
    success: {
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      borderHover: 'hover:border-emerald-300',
    },
    warning: {
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      borderHover: 'hover:border-amber-300',
    },
    danger: {
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      borderHover: 'hover:border-rose-300',
    },
    info: {
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      borderHover: 'hover:border-blue-300',
    },
  }[variant] || {
    iconBg: 'bg-slate-100 text-slate-700',
    borderHover: 'hover:border-slate-300',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 ${
        variantStyles.borderHover
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
            {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl ${variantStyles.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 truncate">{subtitle}</span>

        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              trendDirection === 'up'
                ? 'text-emerald-600'
                : trendDirection === 'down'
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {trendDirection === 'up' && <ArrowUpRight className="h-3.5 w-3.5" />}
            {trendDirection === 'down' && <ArrowDownRight className="h-3.5 w-3.5" />}
            {trendDirection === 'neutral' && <Minus className="h-3.5 w-3.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
