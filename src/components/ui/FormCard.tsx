import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface FormCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function FormCard({ title, subtitle, children }: FormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
