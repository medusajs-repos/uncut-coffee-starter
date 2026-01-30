import { clsx } from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={clsx(
        "appearance-none shadow-none outline-none focus:outline-none",
        "border border-zinc-200",
        "rounded-none",
        "text-base font-medium text-zinc-900",
        "px-4 py-2 w-full",
        "bg-white",
        "placeholder:text-zinc-600",
        className
      )}
      {...props}
    />
  );
};
