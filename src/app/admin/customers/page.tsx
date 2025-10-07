
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>View and manage your customer list.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Customers content goes here. You can display a list of all registered users, their order history, and contact information.</p>
        </CardContent>
      </Card>
    </main>
  );
}
