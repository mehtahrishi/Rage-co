
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ProductsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your product inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Products content goes here. You can build a product table with options to add, edit, and delete items.</p>
        </CardContent>
      </Card>
    </main>
  );
}
