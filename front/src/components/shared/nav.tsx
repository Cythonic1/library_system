import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Book, BookOpen, Compass, Info, Library, Search, TrendingUp } from "lucide-react";

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, icon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none flex items-center">
              {icon}
              {title}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

const Nav: React.FC = () => {
  const pathname = "/"; // You might want to use usePathname() from next/navigation if using Next.js

  return (
    <NavigationMenu>
      <NavigationMenuList>
     

        <NavigationMenuItem>
          <NavigationMenuTrigger
            
            className={cn(

                pathname.startsWith("/books") ? "bg-primary/10 text-primary size-5" : ""
            )}
          >
            <Book className="mr-2 h-4 w-4" />
            <span>Books</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary p-6 no-underline outline-none focus:shadow-md"
                    href="/books"
                  >
                    <BookOpen className="h-6 w-6 text-white" />
                    <div className="mt-4 mb-2 text-lg font-medium text-white">
                      Explore Our Collection
                    </div>
                    <p className="text-sm leading-tight text-white/90">
                      Discover thousands of books across various genres and topics.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="/books/category/fiction"
                title="Fiction"
                icon={<Library className="h-4 w-4 mr-2" />}
              >
                Explore novels, short stories, and literary works.
              </ListItem>
              <ListItem
                href="/books/category/non-fiction"
                title="Non-Fiction"
                icon={<Info className="h-4 w-4 mr-2" />}
              >
                Discover biographies, history, science, and more.
              </ListItem>
              <ListItem
                href="/books/category/children"
                title="Children's Books"
                icon={<Book className="h-4 w-4 mr-2" />}
              >
                Books for young readers of all ages.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={pathname.startsWith("/discover") ? "bg-primary/10 text-primary" : ""}
          >
            <Compass className="mr-2 h-4 w-4" />
            <span>Discover</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem
                href="/books/new-releases"
                title="New Releases"
                icon={<TrendingUp className="h-4 w-4 mr-2" />}
              >
                The latest additions to our library.
              </ListItem>
              <ListItem
                href="/books/popular"
                title="Popular Books"
                icon={<BookOpen className="h-4 w-4 mr-2" />}
              >
                Most borrowed books this month.
              </ListItem>
              <ListItem
                href="/books/recommendations"
                title="Recommendations"
                icon={<Search className="h-4 w-4 mr-2" />}
              >
                Personalized book recommendations.
              </ListItem>
              <ListItem
                href="/events"
                title="Events"
                icon={<Compass className="h-4 w-4 mr-2" />}
              >
                Book clubs, author talks, and more.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

   
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Nav;