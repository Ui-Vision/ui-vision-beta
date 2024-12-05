"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  price: z.number().min(1, "Price must be at least 1"),
  description: z.string().optional(),
  categoryId: z.string().nonempty("Please select a category"),
  filterTagIds: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AccountProducts = () => {
  const { user, loading } = useSelector((state: RootState) => ({
    user: state.user,
    loading: state.user.loading,
  }));

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [filterTags, setFilterTags] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      categoryId: "",
      filterTagIds: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories and filter tags:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/products/filterTags");
        setFilterTags(data.filterTags);
      } catch (error) {
        console.error("Error fetching categories and filter tags:", error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (values: ProductFormValues) => {
    if (!user?.id) {
      alert("User not authenticated!");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post("/api/products/add", {
        ...values,
        userId: user.id,
        categoryIds: [values.categoryId], 
      });
      alert("Product added successfully!");
      form.reset();
    } catch (error: any) {
      console.error("Error adding product:", error);
      alert("Failed to add product!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter product price"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="filterTagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filter Tags</FormLabel>
              <FormControl>
                <Select
                  onValueChange={
                    (value) => field.onChange([...(field.value || []), value]) // Ensure field.value is an array
                  }
                  defaultValue=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select filter tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Product"}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProducts;
