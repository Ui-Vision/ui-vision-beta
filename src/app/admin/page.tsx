"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

const filterTagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  value: z.string().min(1, "Value is required"),
  category: z.string().min(1, "Category is required"), 
});
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  slug: z.string().min(1, "Slug is required"),
  subTitle: z.string().min(2, "SubTitle must be at least 2 characters long"),
  status: z.enum(["ACTIVE", "OFF"], {
    errorMap: () => ({ message: "Select a status" }),
  }),
});

type FilterTagFormData = z.infer<typeof filterTagSchema>;
type CategoryFormData = z.infer<typeof categorySchema>;

export default function AdminForms() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterTagFormData>({
    resolver: zodResolver(filterTagSchema),
  });

  const {
    register: categoryRegister,
    handleSubmit: categoryHandleSubmit,
    formState: { errors: categoryErrors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await fetch("/api/categories");
      const result = await data.json();
      setCategories(result.categories);
    };

    fetchCategories();
  }, []);

  const onSubmitFilterTag = async (data: FilterTagFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/products/filterTags", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Filter tag created successfully!");
      } else {
        alert("Failed to create filter tag.");
      }
    } catch (error) {
      alert("Error creating filter tag.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitCategory = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Category created successfully!");
      } else {
        alert("Failed to create category.");
      }
    } catch (error) {
      alert("Error creating category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Add Category Form */}
      <form
        onSubmit={categoryHandleSubmit(onSubmitCategory)}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold">Add Category</h3>

        <div>
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter category name"
            {...categoryRegister("name")}
            className="mt-2"
          />
          {categoryErrors.name && (
            <p className="text-red-500 text-sm mt-1">
              {categoryErrors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block font-medium">
            Slug
          </label>
          <Input
            id="slug"
            placeholder="Enter category slug"
            {...categoryRegister("slug")}
            className="mt-2"
          />
          {categoryErrors.slug && (
            <p className="text-red-500 text-sm mt-1">
              {categoryErrors.slug.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subTitle" className="block font-medium">
            SubTitle
          </label>
          <Input
            id="subTitle"
            placeholder="Enter category subtitle"
            {...categoryRegister("subTitle")}
            className="mt-2"
          />
          {categoryErrors.subTitle && (
            <p className="text-red-500 text-sm mt-1">
              {categoryErrors.subTitle.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block font-medium">
            Status
          </label>
          <select {...categoryRegister("status")}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="OFF">OFF</option>
          </select>
          {categoryErrors.status && (
            <p className="text-red-500 text-sm mt-1">
              {categoryErrors.status.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Category"}
        </Button>
      </form>

      <form onSubmit={handleSubmit(onSubmitFilterTag)} className="space-y-4">
        <h3 className="text-xl font-bold">Add Filter Tag</h3>

        <div>
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter filter tag name"
            {...register("name")}
            className="mt-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="value" className="block font-medium">
            Value
          </label>
          <Input
            id="value"
            placeholder="Enter filter tag value"
            {...register("value")}
            className="mt-2"
          />
          {errors.value && (
            <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block font-medium">
            Category
          </label>
          <select
            id="category"
            // name="category"
            {...register("category", { required: "Category is required" })}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>

          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Filter Tag"}
        </Button>
      </form>
    </div>
  );
}
