import { colors } from "@toss/tds-colors";
import type { HTMLAttributes, PropsWithChildren } from "react";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

function Card({ children, className, style, ...props }: CardProps) {
  return (
    <div
      className={`${className ?? ""}`}
      style={{
        padding: "24px 40px",
        borderRadius: 24,
        backgroundColor: colors.whiteOpacity50,
        border: `1px solid ${colors.grey100}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
