import { useState } from "react"

export function HoverButton({
  onClick,
  disabled = false,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}) {
  const [hover, setHover] = useState(false)

  return (
    <button onClick={onClick} disabled={disabled}>
      <img
        src={
          hover
            ? "https://pixelady.s3.amazonaws.com/aura-petz/connect_selected.webp"
            : "https://pixelady.s3.amazonaws.com/aura-petz/connect_unselected.webp"
        }
        width="611"
        height="394"
        alt="connect wallet"
        style={{ transition: "filter 0.5s ease-in-out" }}
        className={`w-full cursor-pointer transition-all duration-500 $${
          hover ? "filter brightness-75" : ""
        }`}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      />
    </button>
  )
}
