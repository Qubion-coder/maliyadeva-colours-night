interface CrestProps {
  className?: string;
}

/** Official Maliyadeva College crest. */
export default function Crest({ className = '' }: CrestProps) {
  return (
    <img
      src="/crest.png"
      alt="Maliyadeva College crest"
      draggable={false}
      className={`object-contain select-none ${className}`}
    />
  );
}
