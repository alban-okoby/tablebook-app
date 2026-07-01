import Link from "next/link";
import { RestaurantForm } from "@/components/admin/RestaurantForm";

export default function OwnerNewRestaurantPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[720px]">
      <div>
        <p className="text-caption text-[var(--color-mute)] mb-1">
          <Link href="/owner/restaurants" className="hover:underline">My restaurants</Link>
          {` / New`}
        </p>
        <h1 className="text-display-xs text-[var(--color-ink)]">Add a restaurant</h1>
        <p className="text-body-md text-[var(--color-body)] mt-1">
          Fill in the details below to create your listing. It will be reviewed before going live.
        </p>
      </div>

      <RestaurantForm
        createRedirect="/owner/restaurants"
        editRedirect="/owner/restaurants"
      />
    </div>
  );
}
