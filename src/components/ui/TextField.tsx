import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  textarea?: boolean;
};

export default function TextField({ label, textarea = false, id, name, className = '', ...rest }: Props) {
  const inputCls = `w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 ${className}`;

  return (
    <div className="w-full">
      {label && <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      {textarea ? (
        <textarea id={id || name} name={name} className={inputCls} {...(rest as any)} />
      ) : (
        <input id={id || name} name={name} className={inputCls} {...rest} />
      )}
    </div>
  );
}
