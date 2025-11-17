import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg";
  href?: string;
  showText?: boolean;
}

export function Logo({
  variant = "default",
  size = "md",
  href = "/about",
  showText = true,
}: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32, text: "text-lg" },
    md: { width: 44, height: 44, text: "text-xl" },
    lg: { width: 48, height: 48, text: "text-2xl" },
  };

  const logoSrc = variant === "white" ? "/logo-white.png" : "/logo.png";
  const currentSize = sizes[size];

  const content = (
    <div className="flex items-center gap-3 group cursor-pointer">
      {/* Logo Image */}
      <div className="relative transition-transform duration-300 group-hover:scale-105">
        <Image
          src={logoSrc}
          alt="MedRounds Logo"
          width={currentSize.width}
          height={currentSize.height}
          priority
          className="object-contain"
        />
      </div>

      {/* Text */}
      {showText && (
        <div>
          <h1
            className={`${currentSize.text} font-bold tracking-tight ${
              variant === "white" ? "text-white" : "text-gray-900"
            }`}
          >
            MedRounds
          </h1>
          <p
            className={`text-xs font-medium ${
              variant === "white" ? "text-white/80" : "text-gray-500"
            }`}
          >
            Medical Rounds
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
