"use client"

export default function ProductGallery({ images = ["/placeholder1.jpg", "/placeholder2.jpg"] }) {
  return (
    <div>
      <h3>Product Gallery</h3>
      <ul>
        {images.map((image, index) => (
          <li key={index}>Image: {image}</li>
        ))}
      </ul>
    </div>
  )
}

