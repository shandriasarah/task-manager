function Button({ onClick, children, variant = "ghost" }) {
  const variants = {
    ghost: "btn-ghost",
    danger: "btn-danger",
    primary: "btn-primary",
  };

  return (
    <button onClick={onClick} className={variants[variant] || variants.ghost}>
      {children}
    </button>
  );
}
export default Button;
