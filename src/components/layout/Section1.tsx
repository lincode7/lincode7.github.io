import { cn } from "../../utils/helper";
import SlideUP from "../animation/SlideUP";

export default function Section1({
  title,
  labels,
  start = "left",
  children,
  className,
}: {
  title: string;
  labels: string[];
  start?: "left" | "right";
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-12 lg:space-y-30", className)}>
      <div className="relative grid md:grid-cols-[1fr_auto_auto_1fr] gap-x-[15px] gap-y-[5px] uppercase">
        <span
          className={cn(
            "hidden md:block absolute text-[10px]",
            start === "left" && "right-0",
            start === "right" && "left-0"
          )}
        >
          {title}
        </span>

        {...labels.map((label, index) => (
          <SlideUP
            className={cn(
              start === "left"
                ? cn(
                    index % 4 == 0 && "md:col-span-2",
                    (index % 4 == 1 || index % 4 == 3) &&
                      "md:col-start-2 md:col-end-4 justify-self-center",
                    index % 4 == 2 &&
                      "md:col-start-3 md:col-end-5 justify-self-end"
                  )
                : cn(
                    index % 4 == 0 &&
                      "md:col-start-3 md:col-end-5 justify-self-end",
                    (index % 4 == 1 || index % 4 == 3) &&
                      "md:col-start-2 md:col-end-4 justify-self-center",
                    index % 4 == 2 && "md:col-span-2"
                  )
            )}
          >
            <h2 className="overflow-hidden text-4xl md:text-7xl">{label}</h2>
          </SlideUP>
        ))}
      </div>

      <div className="perspective-[1000px]">{children}</div>
    </div>
  );
}
