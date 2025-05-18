import { BookProgressiveBlurHover } from "@/components/home/book-card";
import { MobileNav } from "@/components/shared/mobile/nav";
import Nav from "@/components/shared/nav";
import { NotificationDropdown } from "@/components/shared/notification";
import { UserNav } from "@/components/shared/user-nav";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/axios";
import { Book } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Library } from "lucide-react";
async function fetchBooks(): Promise<Book[]> {
  const response = await apiClient.get("/api/books");
  return response.data;
}
function AllBooks() {
  const { isAuthenticated } = useAuth();

  const {
    data: featuredBooks = [],
    isLoading,
    isError,
    error,
  } = useQuery<Book[], Error>({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  if (isLoading) return <p>Loading books...</p>;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;
  if (featuredBooks.length === 0) return <p>No books found.</p>;

  return (
    <main className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20 bg-background">
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
            {/* <div className="hidden md:block w-72">
              <SearchBar />
            </div> */}

            {!isAuthenticated ? <UserNav /> : <NotificationDropdown />}
          </div>
        </div>
      </header>

      <h1 className="mt-7  pb-3 border-b  w-full font-bold text-5xl">All books</h1>

      <div className="grid mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredBooks.map((book, index) => (
          <div key={index}>
            <a href={`/books/${book.book_id}`}>
              <BookProgressiveBlurHover book={book} />
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AllBooks;
