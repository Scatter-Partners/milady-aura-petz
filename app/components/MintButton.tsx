import { useState } from "react"

export function MintButton({
  handleClick,
  disabled = false,
  image,
  imageHover
}: {
  handleClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean,
  image: string
  imageHover: string
}) {
  const [hover, setHover] = useState(false)

  return (
    <button onClick={handleClick} disabled={disabled}>
      <img
        src={
          hover
            ? imageHover
            : image
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
