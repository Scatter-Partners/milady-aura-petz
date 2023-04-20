import { useState } from "react"

export function MintButton({
  handleClick,
  disabled = false,
}: {
  handleClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}) {
  const [hover, setHover] = useState(false)

  return (
    <button onClick={handleClick} disabled={disabled}>
      <img
        src={
          hover
            ? "https://pixelady.s3.amazonaws.com/aura-petz/mint_button_unselected_small.webp"
            : "https://pixelady.s3.amazonaws.com/aura-petz/mint_button_selected_small.webp"
        }
        width="284"
        height="140"
        alt="mint petz"
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
