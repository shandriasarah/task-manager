function Title({ children, subtitle }) {
  return (
    <div className="text-center space-y-2 mb-2">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-ink-900 via-ink-700 to-accent bg-clip-text text-transparent">
        {children}
      </h1>
      {subtitle && <p className="text-ink-500 text-sm">{subtitle}</p>}
    </div>
  );
}
export default Title;
