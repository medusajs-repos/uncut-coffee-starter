import { clsx } from "clsx";

type ThumbnailProps = {
  thumbnail?: string | null;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-24 h-24",
};

export const Thumbnail = ({ thumbnail, alt, className, size = "md" }: ThumbnailProps) => {
  return (
    <>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={alt}
          className={clsx(sizeClasses[size], "object-cover bg-neutral-50", className)}
        />
      ) : (
        <div
          className={clsx(
            sizeClasses[size],
            "bg-neutral-50 flex items-center justify-center",
            className
          )}
        >
          <span className="text-xs text-neutral-600">No image</span>
        </div>
      )}
    </>
  );
};
