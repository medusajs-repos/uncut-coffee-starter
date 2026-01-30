import { clsx } from "clsx";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "primary" | "secondary" | "danger" | "transparent";
  size?: "full" | "fit";
};

export const Button = ({
  variant = "primary",
  className,
  size = "full",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        "cursor-pointer disabled:cursor-default",
        "inline-flex items-center justify-center gap-2 px-6 py-3",
        "shadow-none appearance-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "text-sm font-medium uppercase tracking-wide",
        "transition-colors duration-200",
        size === "full" && "w-full",
        size === "fit" && "w-fit",
        {
          "bg-black text-white hover:bg-neutral-800 active:bg-neutral-700 border-transparent rounded-[7px]":
            variant === "primary",
          "bg-transparent text-black hover:bg-black hover:text-white active:bg-neutral-800 border border-black rounded-[7px]":
            variant === "secondary",
          "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 border-transparent rounded-[7px]":
            variant === "danger",
          "bg-transparent text-black hover:bg-transparent active:bg-transparent border-transparent":
            variant === "transparent",
        },
        className
      )}
    />
  );
};
