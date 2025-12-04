import { useState, useEffect, useRef } from 'react';
import { cn } from '@axira/shared/utils';
import type { PromptTemplate, PromptPlaceholder } from '../data/promptTemplates';

interface PlaceholderEditorProps {
  template: PromptTemplate;
  onSubmit: (filledTemplate: string) => void;
  onCancel: () => void;
}

export function PlaceholderEditor({ template, onSubmit, onCancel }: PlaceholderEditorProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.placeholders.forEach((p) => {
      initial[p.key] = p.defaultValue || '';
    });
    return initial;
  });

  const [activePlaceholder, setActivePlaceholder] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse template to find placeholder positions
  const renderTemplateWithPlaceholders = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /\{(\w+)\}/g;
    let match;

    while ((match = regex.exec(template.template)) !== null) {
      // Add text before placeholder
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="text-gray-700">
            {template.template.slice(lastIndex, match.index)}
          </span>
        );
      }

      const placeholderKey = match[1];
      const placeholder = template.placeholders.find((p) => p.key === placeholderKey);
      const value = values[placeholderKey] || placeholder?.defaultValue || placeholderKey;

      parts.push(
        <button
          key={`placeholder-${match.index}`}
          onClick={() => setActivePlaceholder(placeholderKey)}
          className={cn(
            'px-1.5 py-0.5 rounded text-blue-600 font-medium underline decoration-blue-300 decoration-2 underline-offset-2',
            'hover:bg-blue-100 transition-colors cursor-pointer',
            activePlaceholder === placeholderKey && 'bg-blue-100'
          )}
        >
          {value}
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < template.template.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="text-gray-700">
          {template.template.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  const handleSubmit = () => {
    let filled = template.template;
    Object.entries(values).forEach(([key, value]) => {
      filled = filled.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    onSubmit(filled);
  };

  const handleValueChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (activePlaceholder && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activePlaceholder]);

  return (
    <div className="bg-white rounded-lg border shadow-lg max-w-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-900">{template.title}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Template Preview */}
      <div className="p-4">
        <p className="text-base leading-relaxed">
          {renderTemplateWithPlaceholders()}
        </p>
      </div>

      {/* Placeholder Editor */}
      {activePlaceholder && (
        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              {template.placeholders.find((p) => p.key === activePlaceholder)?.label}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={values[activePlaceholder] || ''}
            onChange={(e) => handleValueChange(activePlaceholder, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActivePlaceholder(null);
              }
              if (e.key === 'Escape') {
                setActivePlaceholder(null);
              }
            }}
            placeholder={`Enter ${template.placeholders.find((p) => p.key === activePlaceholder)?.label.toLowerCase()}`}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to confirm, click another placeholder to edit it
          </p>
        </div>
      )}

      {/* All Placeholders Quick Edit */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {template.placeholders.map((placeholder) => (
            <button
              key={placeholder.key}
              onClick={() => setActivePlaceholder(placeholder.key)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors',
                activePlaceholder === placeholder.key
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              )}
            >
              <span className="font-medium">{placeholder.label}:</span>
              <span className={values[placeholder.key] ? 'text-gray-900' : 'text-gray-400'}>
                {values[placeholder.key] || placeholder.defaultValue || 'Not set'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 px-4 py-3 border-t bg-gray-50">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <SendIcon className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
