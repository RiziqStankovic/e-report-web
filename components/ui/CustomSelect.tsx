'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/outline'

interface CustomSelectProps {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
  showAddButton?: boolean
  onAddNew?: () => void
  addButtonText?: string
}

export function CustomSelect({
  label,
  error,
  helperText,
  options,
  placeholder,
  value,
  onChange,
  disabled = false,
  className,
  showAddButton = false,
  onAddNew,
  addButtonText = 'Tambah Baru'
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || '')
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === selectedValue)

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue)
    onChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            isOpen && 'border-blue-500 ring-2 ring-blue-500/20',
            className
          )}
        >
          <span className={cn(
            'truncate',
            !selectedOption && 'text-gray-500'
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon 
            className={cn(
              'h-4 w-4 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none',
                    selectedValue === option.value && 'bg-blue-50 text-blue-900'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {selectedValue === option.value && (
                    <CheckIcon className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
              
              {showAddButton && onAddNew && (
                <>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      onAddNew()
                    }}
                    className="flex w-full items-center px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none font-medium"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    {addButtonText}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
