import { clsx } from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={clsx(
        "appearance-none shadow-none outline-none focus:outline-none",
        "border border-neutral-200",
        "rounded-lg",
        "text-base font-bold text-neutral-900",
        "px-3 w-full h-12",
        "bg-neutral-50",
        "placeholder:text-neutral-400 placeholder:font-bold placeholder:uppercase",
        className
      )}
      {...props}
    />
  );
};
