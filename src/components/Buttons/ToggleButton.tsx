import { infer, z } from "zod";

const ToggleButtonValidator = z.object({
  value: z.string(),
  selected: z.boolean(),
  onClick: z.function().args(z.string()).returns(z.void()),
});

type ToggleButtonProps = z.infer<typeof ToggleButtonValidator>;

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  selected,
  onClick,
}) => {
  return (
    <button
      tabIndex={-1}
      type="button"
      className={`inline-button mr-1 ml-1 ${
        selected ? "bg-slate-500 text-white opacity-60" : "opacity-90"
      }`}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
};
