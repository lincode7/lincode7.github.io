import { InView } from "react-intersection-observer";
import { cn } from "../../utils/helper";

export default function SlideUP({
  children,
  className,
  fade = true,
}: {
  children: React.ReactNode;
  className?: string;
  fade?: boolean;
}) {
  return (
    <InView
      threshold={Array.from({ length: 101 }, (_, i) => i * 0.01)}
      rootMargin="100% 0px -20% 0px"
    >
      {({ ref, entry }) => {
        const opacity = entry?.intersectionRatio ?? 0;
        const y = Math.floor(10 * (1 - opacity)) * 4;

        return (
          <div
            ref={ref}
            className={cn("duration-500", className)}
            style={{
              opacity: fade ? opacity : 1,
              transform: `translateY(${y}px)`,
            }}
          >
            {children}
          </div>
        );
      }}
    </InView>
  );
}
