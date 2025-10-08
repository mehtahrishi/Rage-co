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

import { ProductService } from '@/services/database';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/image-upload';

const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().optional(),
  category: z.enum(['Tops', 'Bottoms', 'Accessories']),
  subCategory: z.enum(['Tshirts', 'Vests', 'Baby-tees', 'Pants', 'Shorts', 'Bandanas']),
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

type ProductFormData = z.infer<typeof productFormSchema>;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await ProductService.getProducts();
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
    form.reset({
        ...product,
        details: product.details.join(', '),
        sizes: product.sizes.join(', '),
        colors: product.colors.join(', '),
        imageIds: product.imageIds,
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (productId: string) => {
    try {
      await ProductService.deleteProduct(productId);
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


  const onSubmit = async (data: ProductFormData) => {
    try {
      // Convert comma-separated strings to arrays (imageIds is already an array)
      const productData = {
        ...data,
        details: data.details.split(',').map(item => item.trim()).filter(Boolean),
        sizes: data.sizes.split(',').map(item => item.trim()).filter(Boolean),
        colors: data.colors.split(',').map(item => item.trim()).filter(Boolean),
        imageIds: data.imageIds, // Already an array from ImageUpload component
      };

      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.$id, productData);
        toast({ title: 'Success', description: 'Product updated successfully.' });
      } else {
        await ProductService.createProduct(productData);
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
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your product inventory.</CardDescription>
            </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1" onClick={openNewProductDialog}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Trending</TableHead>
                <TableHead className="hidden md:table-cell">Featured</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.$id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.subCategory}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Checkbox checked={product.isTrending} disabled/>
                    </TableCell>
                     <TableCell className="hidden md:table-cell">
                        <Checkbox checked={product.isFeatured} disabled/>
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
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingProduct(null);
            form.reset();
        }
      }}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the details of your product.' : 'Add a new product to your store.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" {...form.register('name')} className="col-span-3" />
              {form.formState.errors.name && <p className="col-start-2 col-span-3 text-red-500 text-sm">{form.formState.errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">Slug</Label>
              <Input id="slug" {...form.register('slug')} className="col-span-3" />
              {form.formState.errors.slug && <p className="col-start-2 col-span-3 text-red-500 text-sm">{form.formState.errors.slug.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" {...form.register('description')} className="col-span-3" />
              {form.formState.errors.description && <p className="col-start-2 col-span-3 text-red-500 text-sm">{form.formState.errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input 
                id="price" 
                type="number" 
                {...form.register('price', { 
                  valueAsNumber: true 
                })} 
                className="col-span-3" 
              />
              {form.formState.errors.price && <p className="col-start-2 col-span-3 text-red-500 text-sm">{form.formState.errors.price.message}</p>}
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
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
              <Label htmlFor="subCategory" className="text-right">Sub-Category</Label>
              <Controller
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tshirts">T-Shirts</SelectItem>
                      <SelectItem value="Vests">Vests</SelectItem>
                      <SelectItem value="Baby-tees">Baby Tees</SelectItem>
                      <SelectItem value="Pants">Pants</SelectItem>
                      <SelectItem value="Shorts">Shorts</SelectItem>
                      <SelectItem value="Bandanas">Bandanas</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">Details</Label>
              <Input id="details" {...form.register('details')} className="col-span-3" placeholder="Comma-separated"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sizes" className="text-right">Sizes</Label>
              <Input id="sizes" {...form.register('sizes')} className="col-span-3" placeholder="S, M, L, XL (max 10 chars each)" />
              {form.formState.errors.sizes && <p className="col-start-2 col-span-3 text-red-500 text-sm">{form.formState.errors.sizes.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="colors" className="text-right">Colors</Label>
              <Input id="colors" {...form.register('colors')} className="col-span-3" placeholder="Red, Blue, Black (max 10 chars each)" />
              {form.formState.errors.colors && <p className="col-start-2 col-span-3 text-red-500 text-sm">{form.formState.errors.colors.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Product Images</Label>
              <div className="col-span-3">
                <Controller
                  control={form.control}
                  name="imageIds"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      maxImages={5}
                    />
                  )}
                />
                {form.formState.errors.imageIds && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.imageIds.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isFeatured" className="text-right">Featured</Label>
              <Controller
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isFeatured" className="col-span-3"/>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isTrending" className="text-right">Trending</Label>
               <Controller
                control={form.control}
                name="isTrending"
                render={({ field }) => (
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isTrending" className="col-span-3"/>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
