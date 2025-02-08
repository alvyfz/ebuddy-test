const ShinyText = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}: {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`text-[#00095761] bg-clip-text inline-block ${
        disabled ? "" : "animate-shine"
      } ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, #344CB7 40%, rgba(255, 255, 255, 0.8) 50%, #344CB7 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
