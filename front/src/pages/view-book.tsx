import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Library, Share2, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Nav from "@/components/shared/nav";
import { MobileNav } from "@/components/shared/mobile/nav";
import { UserNav } from "@/components/shared/user-nav";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { NotificationDropdown } from "@/components/shared/notification";

function ViewBook() {
  const nav = useNavigate();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const id = params.id;
  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/books/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const handleShare = async () => {
    const shareData = {
      title: book?.title,
      text: `Check out "${book?.title}" by ${book?.author}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "The book link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Error sharing",
        description: "There was an error while trying to share the book.",
        variant: "destructive",
      });
    }
  };

  const Borrow = async () => {

    if (!isAuthenticated) {
      nav("/sign-in", { replace: true });
      return;
    }

    try {
      await apiClient.put(`/api/books/borrowed/${id}`);
      toast({
        title: "Book borrowed successfully!",
        description: `"${book.title}" has been added to your borrowed list.`,
      });
  } catch (error: any) {
      const status = error?.response?.status;
      let message = "Not enough copies available.";

      if (status === 409) {
        message = "Not enough copies available.";
      } else if (status === 404) {
        message = "Book not found.";
      }

      toast({
        title: "Failed to borrow book",
        description: message,
        variant: "destructive",
      });
    }
  };


  if (isLoading)
    return <p className="text-center mt-10">Loading book details...</p>;
  if (isError || !book)
    return <p className="text-center mt-10">Book not found.</p>;

  return (
    <main className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="flex items-center space-x-2">
              <Library className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">
                LibraryHub
              </span>
            </a>
            <Nav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {!isAuthenticated ? <UserNav /> : <NotificationDropdown />}
          </div>
        </div>
      </header>

      {/* Book content */}
      <div className="container py-10">
        <div className="grid gap-6 lg:grid-cols-[350px_1fr] lg:gap-12">
          {/* Cover and buttons */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
              <img
                src={book.url || "/placeholder.svg"}
                alt={book.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={Borrow} className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Borrow Book
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
                <Button onClick={handleShare} variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <p className="text-xl text-muted-foreground">by {book.author}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(4.5)
                            ? "text-yellow-500 fill-yellow-500"
                            : i < 4.5
                            ? "text-yellow-500 fill-yellow-500 opacity-50"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                </div>
                <span className="text-sm font-medium">4.5</span>
                <span className="text-sm text-muted-foreground">
                  (4 reviews)
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <a href={`/books/category/${book.genre.toLowerCase()}`}>
                  <Badge variant="secondary">{book.genre}</Badge>
                </a>
              </div>
            </div>

            <div className="mt-4">
              <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  book.availability_status === "available"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {`${book.counter} copies available`}
              </div>
            </div>

            <Tabs defaultValue="description" className="mt-6">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-muted-foreground">{book.desc}</p>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Publisher</p>
                    <p className="text-sm text-muted-foreground">
                      {book.author}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Published Date</p>
                    <p className="text-sm text-muted-foreground">
                      {book.publication_year}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">English</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Pages</p>
                    <p className="text-sm text-muted-foreground">200</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewBook;
