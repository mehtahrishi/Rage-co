'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useAuth } from '@/context/auth-provider';
import { useEffect, useState } from 'react';
import { ImageService } from '@/services/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { OrderService } from '@/services/orders';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from '@/components/custom-loader';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showAuthLoader, setShowAuthLoader] = useState(true);
  const [paymentTimer, setPaymentTimer] = useState(60); // 1 minute timer
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'generationragers@ybl'; // Fallback to your provided UPI ID

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      country: 'India',
      postalCode: '',
    },
  });

  // Populate form with user data when available
  useEffect(() => {
    if (user) {
      form.setValue('email', user.email || '');

      // Handle name parsing
      if (user.name) {
        const nameParts = user.name.trim().split(' ');
        if (nameParts.length >= 2) {
          // First part is first name, rest are last name
          form.setValue('firstName', nameParts[0]);
          form.setValue('lastName', nameParts.slice(1).join(' '));
        } else {
          // Only one name part, use as first name
          form.setValue('firstName', user.name);
          form.setValue('lastName', '');
        }
      }
    }
  }, [user, form]);

  // Payment timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPaymentModalOpen && paymentTimer > 0) {
      timer = setTimeout(() => {
        setPaymentTimer(prev => prev - 1);
      }, 1000);
    } else if (isPaymentModalOpen && paymentTimer === 0) {
      // Timer expired
      alert('Payment time expired. Order will be cancelled.');
      setIsPaymentModalOpen(false);
      setPaymentTimer(60); // Reset timer
    }
    return () => clearTimeout(timer);
  }, [isPaymentModalOpen, paymentTimer]);

  // Handle authentication loading completion
  const handleAuthLoadingComplete = () => {
    setShowAuthLoader(false);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with checkout.",
        variant: "destructive"
      });
      router.push('/auth/login');
    }
  }, [user, authLoading, router, toast]);

  // Redirect after loader animation
  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        router.push('/profile/orders');
      }, 3000); // Show loader for 3 seconds before redirecting
      return () => clearTimeout(timer);
    }
  }, [showLoader, router]);

  function onSubmit(data: CheckoutFormValues) {
    // Instead of submitting directly, open the confirmation modal
    setIsConfirmModalOpen(true);
  }

  // Handle confirmation modal action
  const handleConfirmPayment = () => {
    setIsConfirmModalOpen(false);
    setIsPaymentModalOpen(true);
    setPaymentTimer(60); // Reset timer to 1 minute
  };

  // Generate UPI payment URL
  const generateUpiUrl = () => {
    const amount = finalTotal.toFixed(2); // Use final total with GST
    const note = 'Liars Order Payment';
    return `upi://pay?pa=${upiId}&pn=Liars&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // Handle payment confirmation
  const handlePaymentSuccess = async () => {
    // Prevent multiple clicks
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);

    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to place an order.",
          variant: "destructive"
        });
        setIsProcessingPayment(false);
        return;
      }

      // Create order in database
      const orderData = {
        userId: user.$id,
        items: items.map(item => ({
          productId: item.product.$id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          color: item.color
        })),
        total: finalTotal,
        shippingAddress: {
          firstName: form.getValues('firstName'),
          lastName: form.getValues('lastName'),
          address: form.getValues('address'),
          apartment: form.getValues('apartment'),
          city: form.getValues('city'),
          country: form.getValues('country'),
          postalCode: form.getValues('postalCode')
        }
      };

      console.log('Creating order with data:', orderData);

      // Create the order
      const createdOrder = await OrderService.createOrder(orderData);
      console.log('Order created successfully:', createdOrder);

      // Show success animation
      setIsPaymentSuccess(true);

      setTimeout(async () => {
        setIsPaymentSuccess(false);
        setIsPaymentModalOpen(false);
        setPaymentTimer(60); // Reset timer
        setIsProcessingPayment(false); // Reset processing state

        // Clear the cart after successful order creation
        await clearCart();
        console.log('Cart cleared successfully');

        setShowLoader(true); // Show custom loader

        // Show success toast
        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been placed and you will be redirected to your orders page.",
        });
      }, 2000); // Show success animation for 2 seconds

    } catch (error) {
      console.error('Error during checkout process:', error);
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
      setIsProcessingPayment(false);
    }
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    setIsPaymentModalOpen(false);
    setPaymentTimer(60); // Reset timer
  };

  // Get image URL for product
  const getProductImageUrl = (imageId: string) => {
    // Try to get image from Appwrite first
    const appwriteUrl = ImageService.getImageUrl(imageId);
    if (appwriteUrl) return appwriteUrl;

    // Fallback to placeholder images
    const placeholderImage = PlaceHolderImages.find(img => img.id === imageId);
    return placeholderImage?.imageUrl || '/placeholder.jpg';
  };

  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate GST (5% of total price)
  const gstAmount = totalPrice * 0.05;
  const finalTotal = totalPrice + gstAmount;

  // Show custom loader while checking authentication
  if (authLoading && showAuthLoader) {
    return <CustomLoader onLoadingComplete={handleAuthLoadingComplete} />;
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">You can't proceed to checkout without any items.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
          Secure Checkout
        </h1>
        <p className="mt-2 text-muted-foreground">Complete your purchase with confidence</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Shipping Form */}
        <div className="lg:pr-8">
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-headline font-semibold">Contact Information</h2>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-headline font-semibold mt-8">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apartment"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apt 4B" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Mumbai" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input disabled placeholder="India" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="400001" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="button" variant="outline" asChild className="flex-1 h-12">
                    <Link href="/cart">Back to Cart</Link>
                  </Button>
                  <Button type="submit" size="lg" className="flex-1 h-12">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl border p-6 shadow-sm h-fit lg:sticky top-24">
          <h2 className="text-2xl font-headline font-semibold mb-6">Order Summary</h2>
          <div className="space-y-6">
            {items.map(item => {
              const imageUrl = getProductImageUrl(item.product.imageIds[0]);
              return (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                    <Image
                      src={imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold line-clamp-1">
                      <span className="text-muted-foreground mr-2">x{item.quantity}</span>
                      {item.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.size} / {item.color}</p>
                    <p className="font-semibold mt-1">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <Separator className="my-6" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (5%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-xl">₹{finalTotal.toFixed(2)}</span>
          </div>
          <div className="mt-6 text-xs text-muted-foreground">
            <p>By placing your order, you agree to our</p>
            <div className="flex gap-2 mt-1">
              <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
              <span>and</span>
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Confirmation</DialogTitle>
            <DialogDescription>
              Please read the following payment instructions carefully
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="bg-muted border rounded-lg p-4">
              <h3 className="font-semibold">Important Payment Instructions</h3>
              <p className="text-sm mt-2">
                Kindly complete your payment using the QR code provided. A timestamp will be recorded to verify your payment on our sales system.
                Please note that failure to complete the payment within the allotted time frame will result in automatic order cancellation.
                You have exactly one minute to complete this transaction.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmPayment}
              >
                I Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={handlePaymentCancel}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
            <DialogDescription>
              Scan the QR code with any UPI app to pay ₹{finalTotal.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG
                value={generateUpiUrl()}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">Amount: ₹{finalTotal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Scan with any UPI app (Google Pay, PhonePe, Paytm, etc.)
              </p>
              <div className="mt-2 p-2 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-800">
                  Time remaining: {formatTime(paymentTimer)}
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handlePaymentCancel}
                disabled={isProcessingPayment}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handlePaymentSuccess}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Processing...' : 'Payment Done'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Success Animation */}
      <Dialog open={isPaymentSuccess} onOpenChange={setIsPaymentSuccess}>
        <DialogContent className="sm:max-w-md bg-black text-white border-0">
          <DialogHeader>
            <DialogTitle className="sr-only">Payment Successful</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.5
              }}
              className="relative w-24 h-24 flex items-center justify-center"
            >
              {/* Outer circle */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              />

              {/* Checkmark */}
              <motion.svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>

              {/* Arrows */}
              <motion.div
                className="absolute inset-0"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <svg width="96" height="96" viewBox="0 0 24 24" className="absolute inset-0">
                  <path
                    d="M12 2v4M12 18v4M4 12h4M18 12h4M6.34 6.34l2.83 2.83M14.83 14.83l2.83 2.83M6.34 17.66l2.83-2.83M14.83 9.17l2.83-2.83"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
            <motion.h3
              className="text-2xl font-bold mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Payment Successful!
            </motion.h3>
            <motion.p
              className="text-gray-300 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Redirecting to your orders...
            </motion.p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Loader */}
      <Dialog open={showLoader} onOpenChange={setShowLoader}>
        <DialogContent className="sm:max-w-md bg-background border-0">
          <DialogHeader>
            <DialogTitle className="sr-only">Processing Order</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-muted animate-spin border-t-primary"></div>
            </div>
            <h3 className="text-xl font-semibold mt-6">Processing Order</h3>
            <p className="text-muted-foreground mt-2">Please wait while we confirm your order</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}