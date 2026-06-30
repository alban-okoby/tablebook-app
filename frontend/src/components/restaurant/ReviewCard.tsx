import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui";
import type { Review } from "@/types/restaurant";

interface ReviewCardProps {
  review: Review;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-[var(--spacing-xxs)]">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          style={{ color: star <= rating ? "var(--color-primary)" : "var(--color-mute)" }}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { user, rating, title, body, createdAt, isEdited } = review;
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card variant="content" className="flex flex-col gap-[var(--spacing-md)]">
      {/* Header: avatar + name + date */}
      <div className="flex items-center justify-between gap-[var(--spacing-md)]">
        <div className="flex items-center gap-[var(--spacing-md)]">
          <div className="relative w-10 h-10 rounded-[var(--radius-full)] overflow-hidden bg-[var(--color-canvas-soft)] shrink-0">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.username} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-body-md-strong text-[var(--color-body)]">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-body-sm-strong text-[var(--color-ink)]">{user.username}</p>
            <p className="text-caption text-[var(--color-mute)]">
              {date}{isEdited ? " · edited" : ""}
            </p>
          </div>
        </div>
        <StarRating rating={rating} />
      </div>

      {/* Content */}
      {title && <p className="text-body-md-strong text-[var(--color-ink)]">{title}</p>}
      <p className="text-body-md text-[var(--color-body)]">{body}</p>
    </Card>
  );
}
