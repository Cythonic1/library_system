import { BookOpen, ChevronRight, Library, Star, Users } from "lucide-react";
import Nav from "./components/shared/nav";
import { MobileNav } from "./components/shared/mobile/nav";
import { UserNav } from "./components/shared/user-nav";
import { Button } from "./components/ui/button";
import { FeaturedBooks } from "./components/home/featured-books";
import { BookCategories } from "./components/home/book-categories";
import  { NotificationDropdown } from "./components/shared/notification";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isAuthenticated } = useAuth();




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
     
            {!isAuthenticated? <UserNav />:<NotificationDropdown/>}
          </div>
        </div>
      </header>
      <main className="flex-1 w-full  absolute left-0">
        {/* Hero Section */}
        <section className="relative  overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-accent/5 z-0"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5 z-0"></div>

          <div className="container relative z-10 py-20 md:py-28">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  <Star className="mr-1 h-3 w-3 fill-primary" />
                  <span>Discover your next favorite book</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Your <span className="text-primary">Digital Library</span> Experience
                </h1>

                <p className="text-lg text-muted-foreground max-w-[600px]">
                  Explore thousands of books, manage your reading list, and connect with a community of book lovers.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="/books">
                    <Button size="lg" >
                      Browse Books
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="/auth/sign-up">
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      Create Account
                    </Button>
                  </a>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <BookOpen className="mr-1 h-4 w-4 text-primary" />
                    <span>10,000+ Books</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4 text-primary" />
                    <span>5,000+ Members</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-30 blur-xl"></div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 p-2">
                  <img
                    alt="Library Hero"
                    
                    className="h-full w-full rounded-lg object-cover object-center"
                    src="/images/image1.jpg"
                  />

                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-medium">New Releases</div>
                        <div className="text-xs text-muted-foreground">Updated weekly</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-medium">Top Rated</div>
                        <div className="text-xs text-muted-foreground">Reader favorites</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

             {/* Featured Books Section */}
        <section className="py-16 bg-muted/30" id="Featured">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                <BookOpen className="mr-1 h-3 w-3" />
                <span>Featured Collection</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trending This Month</h2>
              <p className="max-w-[700px] text-muted-foreground">
                Explore our curated selection of books that readers are loving right now.
              </p>
            </div>

            <FeaturedBooks />

            <div className="mt-12 text-center">
              <a href="/all">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  View All Books
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>


                {/* Categories Section */}
        <section className="py-16">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="inline-flex items-center rounded-full bg-accent/50 px-3 py-1 text-sm ">
                <Library className="mr-1 h-3 w-3" />
                <span>Browse by Category</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Find Your Perfect Genre</h2>
              <p className="max-w-[700px] text-muted-foreground">
                Discover books in your favorite genres and explore new interests.
              </p>
            </div>

            <BookCategories />
          </div>
        </section>
      </main>
    </main>
  );
}

export default App;
