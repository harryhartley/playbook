interface TagProps {
  text: string
}

export const Tag = ({text}: TagProps) => {
  return (
    <div className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
      {text}
    </div>
  )
}