// src/components/layout/Header.tsx (更新版)
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { NAVIGATION } from "../../utils/constants";
import { cn } from "../../utils/helper";

function Logo({ isTop }: { isTop: boolean }) {
  return (
    <a
      href="/"
      className={cn(
        "fixed lg:relative top-2.5 lg:top-0",
        "block w-[97px] justify-self-center lg:justify-self-start",
        "duration-400",
        !isTop ? "opacity-100" : "opacity-0 lg:opacity-100"
      )}
    >
      <span
        className={cn("text-2xl font-bold duration-500", isTop && "opacity-20")}
      >
        Xuanlin.
      </span>
    </a>
  );
}

function Menu({
  isTop,
  isMenuOpen,
  setIsMenuOpen,
}: {
  isTop: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}) {
  return (
    <>
      <button
        className={cn(
          "fixed lg:absolute left-[calc(50%-40px)] lg:left-auto bottom-0 lg:bottom-[initial] lg:top-0",
          "flex-center flex-col gap-2.5",
          "py-5 lg:py-6 justify-self-center",
          "z-20",
          "text-center text-[9px] tracking-[0.0em] uppercase",
          "group",
          "transition-opacity duration-500",
          !isMenuOpen && isTop && "pointer-events-none opacity-0"
        )}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="bg-foreground w-20 lg:w-[140px] lg:group-hover:w-[150px] duration-400 h-[5px] rounded-[3px]" />
        <span
          key={isMenuOpen ? 1 : 0}
          className="font-semibold animate-fade-in"
        >
          {isMenuOpen ? "Fermer" : "Menu"}
        </span>
      </button>
      {/* Bottom Menu Mask (mobile only) */}
      <div
        className={cn(
          "lg:hidden",
          "fixed bottom-0 left-0 w-full h-[70px]",
          "z-0",
          "bg-linear-to-t from-background to-background/40 duration-500",
          isTop && "opacity-0"
        )}
      />
    </>
  );
}

function Nav({ isMenuOpen }: { isMenuOpen: boolean }) {
  return (
    <div
      className={cn(
        "fixed bottom-2.5 lg:bottom-[initial] lg:top-0 left-0",
        "w-full pt-2.5 px-2.5 z-10",
        !isMenuOpen && "pointer-events-none"
      )}
    >
      <nav className="relative w-full text-center pt-10 lg:pt-[15px] pb-2.5 lg:flex lg:flex-col lg:items-center lg:gap-20">
        <ul
          className={cn(
            "relative mb-[50px] lg:mb-[30px] lg:mt-[90px] grid gap-[5px] lg:gap-0 z-10 group"
          )}
        >
          {...NAVIGATION.map((page, index) => {
            return (
              <li key={index} className="uppercase overflow-hidden">
                <a
                  key={index}
                  href={page.path}
                  className={cn(
                    "block mx-auto text-2xl md:text-4xl font-semibold text-foreground/70",
                    isMenuOpen
                      ? cn(
                          "translate-y-0 opacity-100",
                          "duration-400 delay-400",
                          "group-hover:opacity-20 group-hover:hover:opacity-100"
                        )
                      : cn(
                          "translate-y-[110%] lg:-translate-y-[110%] opacity-0",
                          "duration-500"
                        )
                  )}
                >
                  {page.name}
                </a>
              </li>
            );
          })}
        </ul>
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-full z-0",
            "rounded-[10px] backdrop-blur-[100px] bg-muted/40",
            "origin-bottom lg:origin-top",
            isMenuOpen
              ? "scale-y-100 transition-transform duration-800"
              : "scale-y-0 transition-transform duration-600 delay-200"
          )}
        />
      </nav>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "absolute lg:fixed top-2.5 lg:top-6 right-5 lg:right-12",
        "py-1",
        "rounded-lg hover:text-primary duration-400"
      )}
      aria-label="切换主题"
    >
      {theme === "light" ? (
        <Moon className="animate-fade-in" />
      ) : (
        <Sun className="animate-fade-in" />
      )}
    </button>
  );
}

export default function Header() {
  const [isTop, setIsTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = () => setIsTop(window.scrollY === 0);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "absolute lg:fixed w-full",
        "grid grid-cols-3",
        "py-2.5 md:py-6 px-12",
        "z-20",
        "bg-linear-to-b from-background via-background/40 to-transparent",
        !isTop && "before:opacity-100 lg:before:content-none"
      )}
    >
      <Logo isTop={isTop} />

      <Menu
        isTop={isTop}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <Nav isMenuOpen={isMenuOpen} />
      {/* Action */}
      <ThemeToggle />
    </header>
  );
}
