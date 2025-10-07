
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Review your store's performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Analytics content goes here. You can add more detailed charts and reports for sales, traffic, and customer behavior.</p>
        </CardContent>
      </Card>
    </main>
  );
}
