import React, { ChangeEvent, useState } from 'react'
import { Input } from '../ui/input'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'

interface Props {
  name: string
  value: string
  label: string
  type: 'email' | 'password' | 'text' | string
  Icon?: LucideIcon
  placeholeder: string
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const InputForm: React.FC<Props> = (props) => {
  const {
    name,
    label,
    value,
    type,
    Icon,
    placeholeder,
    handleChange
  } = props

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisiblility = () => { setShowPassword(!showPassword) }

  const inputType = type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type



  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
        {label}
      </label>
      <div className='mt-1 relative'>
        <div className="relative">
          {Icon && (<Icon className='h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />)}
          <Input
            name={name}
            type={inputType}
            value={value}
            onChange={handleChange}
            placeholder={placeholeder}
            className={`pl-10 ${type === 'password' ? 'pr-10' : ''}`}
            autoComplete={
              type === 'email' ? 'email' :
                type === 'password' ? 'current-password' :
                  type === 'name' ? 'name' :
                    ''
            }
            required
          />

          {type === 'password' && (
            <button
              type='button'
              onClick={togglePasswordVisiblility}
              className='absolute right-3 top-1/2 -translate-y-1/2 z-10'
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5 text-gray-400' />
              ) : (
                <Eye className='h-5 w-5 text-gray-400' />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )


}
