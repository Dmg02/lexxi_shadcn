"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddCustomerDrawer from '@/components/customers/add-customer';

export default function CustomersPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={openDrawer}>Add New Customer</Button>
        </CardContent>
      </Card>

      <AddCustomerDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
}
 