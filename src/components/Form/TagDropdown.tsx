import type { UseFormRegister } from 'react-hook-form'
import type { PlayForm } from './CreateUpdatePlay'

interface TagDropdownProps {
  register: UseFormRegister<PlayForm>
  label: keyof PlayForm
  placeholder: string
  o: object
}

export const TagDropdown = ({ register, label, placeholder, o }: TagDropdownProps) => {
  return (
    <div className='mb-6 w-full px-3'>
      <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700' htmlFor={placeholder}>
        {placeholder}
      </label>
      <select
        id={label}
        className='block w-full rounded border border-gray-200 bg-gray-200 py-3 px-4 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
        {...register(label)}
      >
        {Object.keys(o).map((item, idx) => (
          <option value={item} key={`${label}-${idx}`}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}
