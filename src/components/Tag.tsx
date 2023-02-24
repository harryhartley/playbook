interface TagProps {
  text: string
}

export const Tag = ({ text }: TagProps) => {
  return (
    <div className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase'>
      {text}
    </div>
  )
}
