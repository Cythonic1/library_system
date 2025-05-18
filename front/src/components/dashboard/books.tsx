
import { useEffect, useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Book, BookCreate } from "@/lib/types"
import {  useMutation, useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import { toast } from "@/hooks/use-toast"
async function fetchBooks(): Promise<Book[]> {
  const response = await apiClient.get("/api/books")
  return response.data  
}



// add counter update to the book when update the value

 
export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBook, setCurrentBook] = useState<any>(null)
  const [newBook, setNewBook] = useState<BookCreate >({
    title: '',
    author: '',
    publication_year: undefined,
    desc: '',
    genre: '',
    url: '',
    counter: 0,
  })
  
  const filteredBooks = books.filter(
    (book:any) =>
     (book.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.author || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.genre || "").toLowerCase().includes(searchTerm.toLowerCase())

  )




  const handleDeleteBook = () => {
    DeleteBookMutation()
  
  }


  const createBook = async () => {
    const res = await apiClient.post('/api/books/create', newBook)
    return res.data
  }

  const deleteBook = async () => {
    const res = await apiClient.delete(`/api/books/${currentBook.book_id}`)
    return res.data
  }

  const updateBook = async (bookId: number, bookData: any) => {
    const res = await apiClient.put(`/api/books/${bookId}`, bookData);
    return res.data;
  };

  const { mutate: updateBookMutation } = useMutation({
    mutationFn: ({ bookId, bookData }: { bookId: number; bookData: any }) => 
      updateBook(bookId, bookData),
    onSuccess: (updatedBook) => {
      toast({
        title: "Book updated successfully",
      });
      setBooks(books.map(book => 
        book.book_id === updatedBook.book_id ? updatedBook : book
      ));
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error updating book",
        variant: "destructive",
      });
    }
  });
  const handleEditBook = () => {
      if (!currentBook) return;
      
      // Prepare the update data - only include changed fields
      const updateData = {
        title: currentBook.title,
        author: currentBook.author,
        publication_year: currentBook.year,
        genre: currentBook.category,
        url: currentBook.url,
        desc: currentBook.description,
        counter: currentBook.counter,
        // availability_status will be handled by the backend based on counter
      };

      updateBookMutation({ 
        bookId: currentBook.book_id, 
        bookData: updateData 
      });
  };

  const { mutate: DeleteBookMutation } = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      toast(
        {
          title:"Deleted book",
        }
      )
      setBooks(books.filter((book:any) => book.book_id !== currentBook.book_id))
      setIsAddDialogOpen(false)
    },
  })
  const { mutate: createBookMutation, } = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      toast(
        {
          title:"Created new book",
          description:"book was created now anyone can read your book!"
        }
      )
    
      setIsAddDialogOpen(false)
    },
  })
  const { data: featuredBooks = [], isLoading } = useQuery<Book[], Error>({
    queryKey: ["table-books"],
    queryFn: fetchBooks,
  })


  useEffect(() => {
    if (featuredBooks.length > 0) {
      setBooks(featuredBooks)
    }
  }, [featuredBooks])


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Books</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Add a new book to your digital library.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">
                  Author
                </Label>
                <Input
                  id="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newBook.desc}
                  onChange={(e) => setNewBook({ ...newBook, desc: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">
                  Year
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={newBook.publication_year}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      publication_year: Number.parseInt(e.target.value, 10),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select onValueChange={(value) => setNewBook({ ...newBook, genre: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Mystery">Mystery</SelectItem>
                    <SelectItem value="Biography">Biography</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Self-Help">Self-Help</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={newBook.url}
                  onChange={(e) => setNewBook({ ...newBook, url: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  Avaliable copy
                </Label>
                <Input
                  id="url"
                  type="number"
                  value={newBook.counter}
            onChange={(e) => setNewBook({ ...newBook, counter: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={()=>createBookMutation()} disabled={!newBook.title || !newBook.author || isLoading}>
                Add Book
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Management</CardTitle>
          <CardDescription>Manage your digital library books. Total books: {books.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="hidden md:table-cell">Year</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No books found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map((book:any) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell className="hidden md:table-cell">{book.year}</TableCell>
                      <TableCell className="hidden md:table-cell">{book.category}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={book.available ? "default" : "secondary"}>
                          {book.available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{book.views}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentBook(book)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCurrentBook(book)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>Update the details of this book.</DialogDescription>
          </DialogHeader>
          {currentBook && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={currentBook.title}
                  onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-author" className="text-right">
                  Author
                </Label>
                <Input
                  id="edit-author"
                  value={currentBook.author}
                  onChange={(e) => setCurrentBook({ ...currentBook, author: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={currentBook.desc}
                  onChange={(e) =>
                    setCurrentBook({
                      ...currentBook,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-year" className="text-right">
                  Year
                </Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={currentBook.publication_year}
                  onChange={(e) =>
                    setCurrentBook({
                      ...currentBook,
                      year: Number.parseInt(e.target.value, 10),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={currentBook.genre}
                  onValueChange={(value) => setCurrentBook({ ...currentBook, genre: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Mystery">Mystery</SelectItem>
                    <SelectItem value="Biography">Biography</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Self-Help">Self-Help</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">
                  URL
                </Label>
                <Input
                  id="edit-url"
                  value={currentBook.url}
                  onChange={(e) => setCurrentBook({ ...currentBook, url: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-available" className="text-right">
                  Available
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="edit-available"
                    checked={currentBook.availability_status}
                    onCheckedChange={(checked) =>
                      setCurrentBook({
                        ...currentBook,
                        availability_status: checked === true,
                      })
                    }
                  />
                  <label
                    htmlFor="edit-available"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Book is available
                  </label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditBook} disabled={!currentBook?.title || !currentBook?.author}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this book? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentBook && (
            <div className="py-4">
              <p className="font-medium">{currentBook.title}</p>
              <p className="text-sm text-muted-foreground">by {currentBook.author}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBook}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
