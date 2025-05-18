
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Rocket, Heart, History, Lightbulb, Globe, Music, Utensils } from "lucide-react"
import { motion } from "framer-motion"

const categories = [
  {
    name: "Fiction",
    icon: BookOpen,
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-300",
    hoverColor: "group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50",
  },
  {
    name: "Science Fiction",
    icon: Rocket,
    color: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-300",
    hoverColor: "group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50",
  },
  {
    name: "Romance",
    icon: Heart,
    color: "bg-pink-100 dark:bg-pink-900/30",
    textColor: "text-pink-600 dark:text-pink-300",
    hoverColor: "group-hover:bg-pink-200 dark:group-hover:bg-pink-800/50",
  },
  {
    name: "History",
    icon: History,
    color: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-600 dark:text-amber-300",
    hoverColor: "group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50",
  },
  {
    name: "Self-Help",
    icon: Lightbulb,
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-600 dark:text-yellow-300",
    hoverColor: "group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50",
  },
  {
    name: "Travel",
    icon: Globe,
    color: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-600 dark:text-green-300",
    hoverColor: "group-hover:bg-green-200 dark:group-hover:bg-green-800/50",
  },
  {
    name: "Arts & Music",
    icon: Music,
    color: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-600 dark:text-red-300",
    hoverColor: "group-hover:bg-red-200 dark:group-hover:bg-red-800/50",
  },
  {
    name: "Cooking",
    icon: Utensils,
    color: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-600 dark:text-orange-300",
    hoverColor: "group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50",
  },
]

export function BookCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {categories.map((category, index) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <a href={`/books/category/${category.name.toLowerCase()}`}>
            <Card className="h-full transition-all hover:shadow-md group border-transparent hover:border-primary/20">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div
                  className={`p-3 rounded-full ${category.color} ${category.hoverColor} transition-colors duration-300 mb-4`}
                >
                  <category.icon className={`h-6 w-6 ${category.textColor}`} />
                </div>
                <h3 className="font-medium text-center group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          </a>
        </motion.div>
      ))}
    </div>
  )
}
