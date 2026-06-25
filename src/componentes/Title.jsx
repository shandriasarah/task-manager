function Title({ children, subtitle }) {
  return (
    <div className="text-center space-y-2 mb-2">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
        {children}
      </h1>
      {subtitle && <p className="text-zinc-400 text-sm">{subtitle}</p>}
    </div>
  );
}
export default Title;
