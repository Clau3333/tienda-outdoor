type FooterProps = {
  year?: number
}

export default function Footer({ year = 2026 }: FooterProps) {
  return (
    <footer className="pie">
      <p className="pie-marca">ALBEDO OUTDOOR</p>
      <p>© {year} ALBEDO Outdoor.</p>
    </footer>
  )
}
