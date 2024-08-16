import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/useAuth';
import { useResource } from '@/hooks/useResource';
import { customerService, CustomerData } from '@/app/service/customerService';
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea

interface AddCustomerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  portal_access: z.boolean(),
  contact_info: z.array(z.object({
    type: z.string(),
    value: z.string()
  })),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const AddCustomerDrawer: React.FC<AddCustomerDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const { control, handleSubmit, reset, setValue, watch } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      description: '',
      portal_access: false,
      contact_info: [],
    },
  });

  const { data: customers } = useResource(
    customerService.getCustomersByOrganization, 
    user?.organization_id
  );

  const customerName = watch('name');
  const handleCustomerSelect = (value: string) => {
    const selectedCustomer = customers?.find(c => c.id === value) as CustomerData | undefined;
    if (selectedCustomer) {
      setSelectedCustomerId(selectedCustomer.id);
      setValue('name', selectedCustomer.name);
      setValue('description', selectedCustomer.description || '');
      setValue('portal_access', selectedCustomer.portal_access);
      setValue('contact_info', selectedCustomer.contact_info);
    } else {
      setSelectedCustomerId(null);
      setValue('name', value);
      // Reset other fields
      setValue('description', '');
      setValue('portal_access', false);
      setValue('contact_info', []);
    }
  };

  const handleAddNewCustomer = (name: string) => {
    setSelectedCustomerId(null);
    setValue('name', name);
    // Reset other fields
    setValue('description', '');
    setValue('portal_access', false);
    setValue('contact_info', []);
  };

  const onSubmit = async (data: CustomerFormData) => {
    if (!user?.organization_id) {
      toast({ title: "Error", description: "User organization not found", variant: "destructive" });
      return;
    }

    try {
      if (selectedCustomerId) {
        // Update existing customer
        await customerService.updateCustomer(user.organization_id, selectedCustomerId, {
          ...data,
          updated_by: user.id,
        });
        toast({ title: "Customer updated successfully" });
      } else {
        // Add new customer
        await customerService.addCustomer({
          ...data,
          organization_id: user.organization_id,
          created_by: user.id,
          updated_by: user.id,
        });
        toast({ title: "Customer added successfully" });
      }
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({ title: "Error saving customer", variant: "destructive" });
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="flex flex-col h-full max-h-screen">
        <DrawerHeader>
          <DrawerTitle>{selectedCustomerId ? 'Edit Customer' : 'Add New Customer'}</DrawerTitle>
          <DrawerDescription>Fill in the details to {selectedCustomerId ? 'update' : 'add'} a customer.</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="flex-1 px-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-6">
            <div>
              <Label htmlFor="name">Customer Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={customers || []}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      handleCustomerSelect(value);
                    }}
                    // onAddNew={handleAddNewCustomer}
                    placeholder="Select existing or enter new customer name"
                    optionKey="id"
                    optionLabel="name"
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea {...field} />}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="portal_access"
                control={control}
                render={({ field }) => <Switch {...field} />}
              />
              <Label htmlFor="portal_access">Portal Access</Label>
            </div>

            <div>
              <Label>Contact Information</Label>
              <Controller
                name="contact_info"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    {field.value.map((contact, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder="Type"
                          value={contact.type}
                          onChange={(e) => {
                            const newContactInfo = [...field.value];
                            newContactInfo[index].type = e.target.value;
                            field.onChange(newContactInfo);
                          }}
                        />
                        <Input
                          placeholder="Value"
                          value={contact.value}
                          onChange={(e) => {
                            const newContactInfo = [...field.value];
                            newContactInfo[index].value = e.target.value;
                            field.onChange(newContactInfo);
                          }}
                        />
                        <Button type="button" onClick={() => {
                          const newContactInfo = field.value.filter((_, i) => i !== index);
                          field.onChange(newContactInfo);
                        }}>Remove</Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => field.onChange([...field.value, { type: '', value: '' }])}>
                      Add Contact Info
                    </Button>
                  </div>
                )}
              />
            </div>
          </form>
        </ScrollArea>
        <DrawerFooter>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            {selectedCustomerId ? "Update Customer" : "Add Customer"}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCustomerDrawer;