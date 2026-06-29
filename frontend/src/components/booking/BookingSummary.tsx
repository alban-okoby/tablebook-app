import { Card, Badge } from "@/components/ui";

interface BookingSummaryProps {
  confirmationCode: string;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
}

export function BookingSummary({
  confirmationCode,
  restaurantName,
  date,
  time,
  partySize,
  specialRequests,
}: BookingSummaryProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const rows = [
    { label: "Restaurant", value: restaurantName },
    { label: "Date", value: formattedDate },
    { label: "Time", value: time },
    { label: "Guests", value: `${partySize} ${partySize === 1 ? "guest" : "guests"}` },
    ...(specialRequests ? [{ label: "Special requests", value: specialRequests }] : []),
  ];

  return (
    <Card variant="content" className="flex flex-col gap-[var(--spacing-xl)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-body-md-strong text-[var(--color-ink)]">Booking summary</p>
        <Badge variant="warning">Pending confirmation</Badge>
      </div>

      {/* Confirmation code */}
      <div
        className="rounded-[var(--radius-lg)] p-[var(--spacing-lg)] text-center"
        style={{ backgroundColor: "var(--color-primary-pale)" }}
      >
        <p className="text-caption text-[var(--color-body)] mb-[var(--spacing-xs)]">
          Confirmation code
        </p>
        <p className="text-display-sm text-[var(--color-ink)]">{confirmationCode}</p>
      </div>

      {/* Detail rows */}
      <div
        className="flex flex-col divide-y"
        style={{ borderColor: "var(--color-canvas-soft)" }}
      >
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between py-[var(--spacing-md)] gap-[var(--spacing-xl)]"
          >
            <span className="text-body-sm text-[var(--color-mute)] shrink-0">{label}</span>
            <span className="text-body-sm text-[var(--color-ink)] text-right">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
