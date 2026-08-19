export const Card = ({ children, className = '' }) => (
  <section className={`rounded-2xl border border-orange-100 bg-white p-5 shadow-sm ${className}`}>
    {children}
  </section>
)
