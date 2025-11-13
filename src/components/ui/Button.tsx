import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'danger' | 'ghost';
};

export default function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  const base = 'cursor-pointer inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none';

  // inline style for primary uses CSS variable defined in globals.css so it works even without Tailwind mapping
  const primaryStyle: React.CSSProperties = {
    backgroundColor: 'var(--brand-navy)',
    color: 'white',
  };

  const classesForVariant: Record<string, string> = {
    primary: 'px-4 py-2',
    danger: 'px-3 py-1 bg-red-600 text-white hover:bg-red-700',
    ghost: 'px-2 py-1 bg-transparent text-gray-700 hover:bg-gray-100',
  };

  const cls = `${base} ${classesForVariant[variant] ?? classesForVariant.primary} ${className}`;

  const style = variant === 'primary' ? primaryStyle : undefined;

  return (
    <button className={cls} style={style} {...props}>{children}</button>
  );
}
