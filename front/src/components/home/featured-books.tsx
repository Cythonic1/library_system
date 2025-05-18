import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { BookProgressiveBlurHover } from "./book-card"
import { Book } from "@/lib/types"
import apiClient from "@/lib/axios"

async function fetchBooks(): Promise<Book[]> {
  const response = await apiClient.get("/api/books")
  return response.data.slice(0,4)  // axios wraps response data inside `.data`
}

export function FeaturedBooks() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { data: featuredBooks = [], isLoading, isError, error } = useQuery<Book[], Error>({
    queryKey: ["books"],
    queryFn: fetchBooks,
  })


  

  // Auto-rotate featured books when books load
  useEffect(() => {
    if (featuredBooks.length === 0) return
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredBooks.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredBooks])

  if (isLoading) return <p>Loading books...</p>
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>
  if (featuredBooks.length === 0) return <p>No books found.</p>

  return (
    <div className="mt-8">
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2">
          {featuredBooks.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === activeIndex ? "bg-primary w-6" : "bg-muted hover:bg-primary/50",
              )}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {featuredBooks.map((book, index) => (
            <motion.div
              key={book.book_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: book.book_id === featuredBooks[activeIndex].book_id ? 1.1 : 1,
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <a href={`/books/${book.book_id}`}>
                <BookProgressiveBlurHover book={book} />
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
