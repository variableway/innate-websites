import { cn } from "@allone/utils"

interface InnateLogoProps {
  size?: number
  className?: string
}

export function InnateLogo({ size = 32, className }: InnateLogoProps) {
  return (
    <div 
      className={cn("rounded-full overflow-hidden", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* 背景圆 */}
        <circle cx="50" cy="50" r="50" fill="#F5F0E6" />
        {/* 中心发光圆 */}
        <circle cx="50" cy="50" r="20" fill="#F5E6C8" />
        {/* 周围几何体 - 简化为小圆点 */}
        <circle cx="25" cy="35" r="8" fill="#8FA68E" />
        <circle cx="75" cy="35" r="8" fill="#7A9CAE" />
        <circle cx="25" cy="65" r="8" fill="#D4845E" />
        <circle cx="75" cy="65" r="8" fill="#9BB5C4" />
      </svg>
    </div>
  )
}

// 用于 LeftBar 的小尺寸 Logo
export function InnateLogoIcon({ className }: { className?: string }) {
  return (
    <div className={cn("w-5 h-5 rounded-full overflow-hidden", className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="50" fill="#F5F0E6" />
        <circle cx="50" cy="50" r="20" fill="#F5E6C8" />
        <circle cx="25" cy="35" r="8" fill="#8FA68E" />
        <circle cx="75" cy="35" r="8" fill="#7A9CAE" />
        <circle cx="25" cy="65" r="8" fill="#D4845E" />
        <circle cx="75" cy="65" r="8" fill="#9BB5C4" />
      </svg>
    </div>
  )
}
