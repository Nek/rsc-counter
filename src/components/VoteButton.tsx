export default function VoteButton({
  description,
  count,
  vote,
}: {
  description: string;
  count: number;
  vote: () => void;
}) {
  return (
    <button onClick={() => vote()}>
      {description}: {count}
    </button>
  );
}
