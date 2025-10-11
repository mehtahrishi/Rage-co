'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { AdminProductService } from '@/services/database';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/image-upload';

// Base schema for creating new products
const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().optional(),
  category: z.enum(['Tops', 'Bottoms', 'Accessories']),
  subCategory: z.enum(['Tshirts', 'Long-sleeves', 'Vests', 'Baby-tees', 'Pants', 'Shorts', 'Bandanas']),
  description: z.string().min(1, 'Description is required'),
  details: z.string(),
  sizes: z.string().refine((val) => {
    const sizes = val.split(',').map(s => s.trim()).filter(Boolean);
    return sizes.every(size => size.length <= 10);
  }, 'Each size must be 10 characters or less'),
  colors: z.string().refine((val) => {
    const colors = val.split(',').map(c => c.trim()).filter(Boolean);
    return colors.every(color => color.length <= 10);
  }, 'Each color must be 10 characters or less'),
  imageIds: z.array(z.string()).min(1, 'At least one image is required'),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().min(0).default(0),
});

// Partial schema for editing existing products - makes fields optional except critical ones
const editProductFormSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  originalPrice: z.number().optional(),
  category: z.enum(['Tops', 'Bottoms', 'Accessories']).optional(),
  subCategory: z.enum(['Tshirts', 'Long-sleeves', 'Vests', 'Baby-tees', 'Pants', 'Shorts', 'Bandanas']).optional(),
  description: z.string().min(1, 'Description is required').optional(),
  details: z.string().optional(),
  sizes: z.string().refine((val) => {
    if (!val) return true; // Allow empty for optional field
    const sizes = val.split(',').map(s => s.trim()).filter(Boolean);
    return sizes.every(size => size.length <= 10);
  }, 'Each size must be 10 characters or less').optional(),
  colors: z.string().refine((val) => {
    if (!val) return true; // Allow empty for optional field
    const colors = val.split(',').map(c => c.trim()).filter(Boolean);
    return colors.every(color => color.length <= 10);
  }, 'Each color must be 10 characters or less').optional(),
  imageIds: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
}).refine((data) => {
  // At least one field must be provided for editing
  return Object.values(data).some(value => value !== undefined && value !== null && value !== '');
}, 'At least one field must be updated');

type ProductFormData = z.infer<typeof productFormSchema>;
type EditProductFormData = z.infer<typeof editProductFormSchema>;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const form = useForm<any>({
    resolver: zodResolver(productFormSchema),
  });

  // Update resolver when switching between edit and create modes
  useEffect(() => {
    const currentResolver = editingProduct ? editProductFormSchema : productFormSchema;
    form.clearErrors();
  }, [editingProduct, form]);

  // Watch category changes to filter subcategories
  const selectedCategory = form.watch('category');

  // Helper function to get subcategories based on selected category
  const getSubcategoriesForCategory = (category: string) => {
    switch (category) {
      case 'Tops':
        return [
          { value: 'Tshirts', label: 'T-Shirts' },
          { value: 'Long-sleeves', label: 'Long Sleeves' },
          { value: 'Baby-tees', label: 'Baby Tees' },
          { value: 'Vests', label: 'Vests' },
        ];
      case 'Bottoms':
        return [
          { value: 'Pants', label: 'Pants' },
          { value: 'Shorts', label: 'Shorts' },
        ];
      case 'Accessories':
        return [
          { value: 'Bandanas', label: 'Bandanas' },
        ];
      default:
        return [];
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await AdminProductService.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch products.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    // Reset form with current product values for editing
    form.reset({
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      details: product.details.join(', '),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      imageIds: product.imageIds,
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      rating: product.rating,
      reviewCount: product.reviewCount,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await AdminProductService.deleteProduct(productId);
      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete product.',
      });
    }
  };


  const onSubmit = async (data: ProductFormData | EditProductFormData) => {
    try {
      let productData: any = {};
      
      if (editingProduct) {
        // For editing, only include fields that have values (partial update)
        Object.keys(data).forEach(key => {
          const value = (data as any)[key];
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'details' && typeof value === 'string') {
              productData[key] = value.split(',').map(item => item.trim()).filter(Boolean);
            } else if (key === 'sizes' && typeof value === 'string') {
              productData[key] = value.split(',').map(item => item.trim()).filter(Boolean);
            } else if (key === 'colors' && typeof value === 'string') {
              productData[key] = value.split(',').map(item => item.trim()).filter(Boolean);
            } else {
              productData[key] = value;
            }
          }
        });
        
        await AdminProductService.updateProduct(editingProduct.$id, productData);
        toast({ title: 'Success', description: 'Product updated successfully.' });
      } else {
        // For creating, convert comma-separated strings to arrays
        const fullData = data as ProductFormData;
        productData = {
          ...fullData,
          details: fullData.details.split(',').map(item => item.trim()).filter(Boolean),
          sizes: fullData.sizes.split(',').map(item => item.trim()).filter(Boolean),
          colors: fullData.colors.split(',').map(item => item.trim()).filter(Boolean),
          imageIds: fullData.imageIds,
        };
        
        await AdminProductService.createProduct(productData);
        toast({ title: 'Success', description: 'Product created successfully.' });
      }
      
      setIsDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save product.',
      });
    }
  };

  const openNewProductDialog = () => {
    setEditingProduct(null);
    // Reset the form with empty values for new product
    form.reset({
      name: '',
      slug: '',
      price: 0,
      originalPrice: undefined,
      category: 'Tops',
      subCategory: 'Tshirts',
      description: '',
      details: '',
      sizes: '',
      colors: '',
      imageIds: [],
      isFeatured: false,
      isTrending: false,
      rating: 0,
      reviewCount: 0,
    });
    setIsDialogOpen(true);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="grid gap-2">
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your product inventory.</CardDescription>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Button size="sm" className="h-8 gap-1 w-full sm:w-auto" onClick={openNewProductDialog}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Add Product</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {products.length > 0 ? (
                  products.map((product) => (
                    <Card key={product.$id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{product.name}</h3>
                          <p className="text-xs text-muted-foreground">{product.subCategory}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(product)}>Edit</DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start text-sm font-normal px-2 py-1.5 text-destructive hover:text-destructive">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(product.$id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Price:</span>
                          <span className="font-medium">₹{product.price}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Trending:</span>
                          <Checkbox checked={product.isTrending} disabled />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Featured:</span>
                          <Checkbox checked={product.isFeatured} disabled />
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No products found.</p>
                  </div>
                )}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Name</TableHead>
                      <TableHead className="min-w-[120px]">Category</TableHead>
                      <TableHead className="min-w-[100px]">Price</TableHead>
                      <TableHead className="min-w-[100px]">Trending</TableHead>
                      <TableHead className="min-w-[100px]">Featured</TableHead>
                      <TableHead className="min-w-[80px]"><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <TableRow key={product.$id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.subCategory}</TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>
                            <Checkbox checked={product.isTrending} disabled />
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={product.isFeatured} disabled />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEdit(product)}>Edit</DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start text-sm font-normal px-2 py-1.5 text-destructive hover:text-destructive">Delete</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the product.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(product.$id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={6}>No products found.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingProduct(null);
          form.reset();
          form.clearErrors();
        }
      }}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Update any field you want to change. You can edit individual fields independently - only modified fields will be updated.' 
                : 'Add a new product to your store. All fields marked with * are required.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name{!editingProduct && ' *'}
              </Label>
              <Input 
                id="name" 
                {...form.register('name')} 
                className="col-span-3" 
                placeholder={editingProduct ? `Current: ${editingProduct.name}` : 'Enter product name'}
              />
              {form.formState.errors.name && <p className="col-start-2 col-span-3 text-red-500 text-sm">{String(form.formState.errors.name.message)}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug{!editingProduct && ' *'}
              </Label>
              <Input 
                id="slug" 
                {...form.register('slug')} 
                className="col-span-3" 
                placeholder={editingProduct ? `Current: ${editingProduct.slug}` : 'Enter product slug'}
              />
              {form.formState.errors.slug && <p className="col-start-2 col-span-3 text-red-500 text-sm">{String(form.formState.errors.slug.message)}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description{!editingProduct && ' *'}
              </Label>
              <Textarea 
                id="description" 
                {...form.register('description')} 
                className="col-span-3" 
                placeholder={editingProduct ? `Current: ${editingProduct.description}` : 'Enter product description'}
              />
              {form.formState.errors.description && <p className="col-start-2 col-span-3 text-red-500 text-sm">{String(form.formState.errors.description.message)}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price{!editingProduct && ' *'}
              </Label>
              <Input
                id="price"
                type="number"
                {...form.register('price', {
                  valueAsNumber: true
                })}
                className="col-span-3"
                placeholder={editingProduct ? `Current: ₹${editingProduct.price}` : 'Enter price'}
              />
              {form.formState.errors.price && <p className="col-start-2 col-span-3 text-red-500 text-sm">{String(form.formState.errors.price.message)}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="originalPrice" className="text-right">Original Price</Label>
              <Input
                id="originalPrice"
                type="number"
                {...form.register('originalPrice', {
                  valueAsNumber: true
                })}
                className="col-span-3"
                placeholder={editingProduct ? `Current: ${editingProduct.originalPrice ? '₹' + editingProduct.originalPrice : 'Not set'}` : 'Enter original price (optional)'}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category{!editingProduct && ' *'}
              </Label>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset subcategory when category changes
                      form.setValue('subCategory', '');
                    }} 
                    value={field.value}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={editingProduct ? `Current: ${editingProduct.category}` : "Select a category"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tops">Tops</SelectItem>
                      <SelectItem value="Bottoms">Bottoms</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subCategory" className="text-right">
                Sub-Category{!editingProduct && ' *'}
              </Label>
              <Controller
                control={form.control}
                name="subCategory"
                render={({ field }) => {
                  const availableSubcategories = getSubcategoriesForCategory(selectedCategory || '');
                  return (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue 
                          placeholder={
                            !selectedCategory 
                              ? "Select a category first" 
                              : editingProduct 
                                ? `Current: ${editingProduct.subCategory}` 
                                : "Select a sub-category"
                          } 
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubcategories.map((subcategory) => (
                          <SelectItem key={subcategory.value} value={subcategory.value}>
                            {subcategory.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">Details</Label>
              <Input 
                id="details" 
                {...form.register('details')} 
                className="col-span-3" 
                placeholder={editingProduct ? `Current: ${editingProduct.details.join(', ')}` : "Comma-separated details"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sizes" className="text-right">
                Sizes{!editingProduct && ' *'}
              </Label>
              <Input 
                id="sizes" 
                {...form.register('sizes')} 
                className="col-span-3" 
                placeholder={editingProduct ? `Current: ${editingProduct.sizes.join(', ')}` : "S, M, L, XL (max 10 chars each)"}
              />
              {form.formState.errors.sizes && <p className="col-start-2 col-span-3 text-red-500 text-sm">{String(form.formState.errors.sizes.message)}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="colors" className="text-right">
                Colors{!editingProduct && ' *'}
              </Label>
              <Input 
                id="colors" 
                {...form.register('colors')} 
                className="col-span-3" 
                placeholder={editingProduct ? `Current: ${editingProduct.colors.join(', ')}` : "Red, Blue, Black (max 10 chars each)"}
              />
              {form.formState.errors.colors && <p className="col-start-2 col-span-3 text-red-500 text-sm">{String(form.formState.errors.colors.message)}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Product Images{!editingProduct && ' *'}
              </Label>
              <div className="col-span-3">
                <Controller
                  control={form.control}
                  name="imageIds"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value || []}
                      onChange={field.onChange}
                      maxImages={5}
                    />
                  )}
                />
                {editingProduct && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Current: {editingProduct.imageIds.length} image(s). Upload new images to replace them.
                  </p>
                )}
                {form.formState.errors.imageIds && (
                  <p className="text-red-500 text-sm mt-1">{String(form.formState.errors.imageIds?.message)}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isFeatured" className="text-right">Featured</Label>
              <Controller
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isFeatured" className="col-span-3" />
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isTrending" className="text-right">Trending</Label>
              <Controller
                control={form.control}
                name="isTrending"
                render={({ field }) => (
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isTrending" className="col-span-3" />
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">Rating</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                {...form.register('rating', {
                  valueAsNumber: true
                })}
                className="col-span-3"
                placeholder={editingProduct ? `Current: ${editingProduct.rating}⭐` : 'Enter rating (0-5)'}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reviewCount" className="text-right">Review Count</Label>
              <Input
                id="reviewCount"
                type="number"
                min="0"
                {...form.register('reviewCount', {
                  valueAsNumber: true
                })}
                className="col-span-3"
                placeholder={editingProduct ? `Current: ${editingProduct.reviewCount} reviews` : 'Enter review count'}
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
