import { notFound } from "next/navigation";
import Link from "next/link";
import { OrderDetail } from "@/components/dashboard/OrderDetail";
import { Button } from "@/components/ui/Button";
import { getOrderById } from "@/lib/mock-orders";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6">
            &larr; Back to Dashboard
          </Button>
        </Link>
        <OrderDetail order={order} />
      </div>
    </div>
  );
}
