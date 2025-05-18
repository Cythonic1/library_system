

import { useState, useEffect, useRef } from "react"


const images = [
  {
    src: "/images/image1.jpg",
    alt: "Library interior with bookshelves",
  },
  {
    src: "/images/image2.webp",
    alt: "Student reading in a library",
  },
  {
    src: "/images/image3.webp",
    alt: "Modern library architecture",
  },

]

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Function to move to the next slide
  const nextSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      setIsTransitioning(false)
    }, 1000) 
  }

  // Set up the timer for automatic sliding
  useEffect(() => {
    timerRef.current = setInterval(() => {
      nextSlide()
    }, 3000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="relative h-full min-h-screen w-full overflow-hidden bg-muted">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0  h-full w-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          } ${isTransitioning ? "scale-105" : "scale-100"}`}
        >
          <img
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            className="object-cover min-h-screen h-screen  object-center transition-transform duration-500 ease-in-out"
            
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 mb-3 p-6 text-white">
          <h2 className="text-2xl font-bold">Library Management System</h2>
          <p className="mt-2">Discover a world of knowledge at your fingertips</p>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? "bg-white w-4" : "bg-white/50"}`}
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsTransitioning(false)
              }, 500)

              // Reset the timer
              if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = setInterval(nextSlide, 3000)
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
