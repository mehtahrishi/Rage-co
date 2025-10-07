
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage and view customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Orders content goes here. You can display a table of recent orders, search functionality, and order details.</p>
        </CardContent>
      </Card>
    </main>
  );
}
