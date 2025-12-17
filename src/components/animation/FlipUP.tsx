import { InView } from "react-intersection-observer";
import { cn } from "../../utils/helper";

export default function FlipDown({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <InView
      threshold={Array.from({ length: 6 }, (_, i) => i * 0.2)}
      rootMargin="100% 0px -10% 0px"
    >
      {({ ref, entry }) => {
        const opacity = entry?.intersectionRatio ?? 0;
        const scale = 0.7 + 0.3 * opacity;
        const rotateX = -90 * (1 - opacity);
        const translateZ = 100 * (1 - opacity);

        return (
          <div
            ref={ref}
            className={cn(
              "transform-3d will-change-transform origin-top duration-200",
              className
            )}
            style={{
              opacity,
              transform: `perspective(1000px) rotateX(${rotateX}deg) translate3d(0px, 0px, ${translateZ}px) scale(${scale})`,
            }}
          >
            {children}
          </div>
        );
      }}
    </InView>
  );
}
