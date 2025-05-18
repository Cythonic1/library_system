
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";

function Dashboard() {

 


  




  return (
    <main className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20 bg-background">
       <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Books</CardTitle>
            <CardDescription>Recently added books to your library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction" },
                { title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction" },
                { title: "1984", author: "George Orwell", category: "Science Fiction" },
                { title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy" },
              ].map((book, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{book.category}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href="/dashboard/books" className="text-sm text-primary hover:underline">
                View all books
              </a>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Recently added users to your library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { username: "johndoe", email: "john@example.com", role: "Admin" },
                { username: "janedoe", email: "jane@example.com", role: "Librarian" },
                { username: "bobsmith", email: "bob@example.com", role: "Librarian" },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "Admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href="/dashboard/users" className="text-sm text-primary hover:underline">
                View all users
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

      
    </main>
  );
}

export default Dashboard;
