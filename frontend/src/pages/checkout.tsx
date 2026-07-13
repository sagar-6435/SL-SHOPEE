import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/checkout')({
  component: PageComponent,
});

export function PageComponent() {
  return (
    <div className="pt-28 sm:pt-32 pb-10 min-h-screen bg-[oklch(0.98_0.005_260)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-white p-6 sm:p-8 shadow-elevated">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Complete your purchase securely.</p>
          <form className="mt-8 space-y-4">
  <input className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-brand" placeholder="Full Name" />
  <input className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-brand" placeholder="Shipping Address" />
  <button className="w-full rounded-xl bg-brand font-semibold text-white py-3">Continue to Payment</button>
</form>
        </div>
      </div>
    </div>
  );
}
