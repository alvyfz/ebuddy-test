import { Loader } from "@mantine/core";

export default function Loading(props: {
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "full";
  className?: string;
}) {
  return (
    <div className={`flex flex-col p-4 justify-center items-center ${props.className}`}>
      <Loader size={props.size ?? "sm"} />
    </div>
  );
}
