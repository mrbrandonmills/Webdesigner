'use client'

interface EditableFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  rows?: number
  maxLength?: number
  hint?: string
}

export function EditableField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 1,
  maxLength,
  hint,
}: EditableFieldProps) {
  const charCount = value.length
  const showCount = maxLength !== undefined

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {showCount && (
          <span
            className={`text-xs ${
              charCount > maxLength
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          maxLength={maxLength}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}

      {hint && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}
    </div>
  )
}
