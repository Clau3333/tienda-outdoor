type PageHeadingProps = {
  title: string
  description?: string
}

export default function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <header className="albedo-page-header">
      <h1 className="albedo-page-title">{title}</h1>
      {description && <p className="albedo-page-description">{description}</p>}
    </header>
  )
}
