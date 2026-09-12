type PlayerAvatarProps = {
  name: string;
  size?: "card" | "profile";
};

export function PlayerAvatar({ name, size = "card" }: PlayerAvatarProps) {
  const initial = Array.from(name)[0] || "雀";

  return (
    <div
      className={`player-avatar player-avatar-${size}`}
      role="img"
      aria-label={`${name}選手の共通プレースホルダー画像`}
    >
      <span aria-hidden="true">{initial}</span>
    </div>
  );
}
