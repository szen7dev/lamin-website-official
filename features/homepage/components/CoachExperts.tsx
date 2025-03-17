"use client"

import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const coaches = [
  {
    id: 1,
    name: "Nguyễn Anh Tuấn",
    title: "Bác sĩ chuyên khoa 1",
    experience: "10 năm kinh nghiệm",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 2,
    name: "Nguyễn Anh Tuấn",
    title: "Bác sĩ chuyên khoa 1",
    experience: "10 năm kinh nghiệm",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 3,
    name: "Nguyễn Anh Tuấn",
    title: "Bác sĩ chuyên khoa 1",
    experience: "10 năm kinh nghiệm",
    image: "/placeholder.svg?height=120&width=120",
  },
]

export default function CoachExperts() {
  return (
    <section className="rounded-2xl bg-gradient-3 p-8" aria-labelledby="coaches-heading">
      <header className="mb-8">
        <h2 id="coaches-heading" className="mb-2 text-3xl font-semibold text-white">
          Coach tư vấn chăm sóc sức khỏe
        </h2>
        <p className="mb-4 text-base font-medium text-white/90">
          Danh sách các Coach tư vấn chăm sóc sức khỏe của Elela
        </p>
        <Button
          variant="secondary"
          className="flex items-center gap-2 rounded-full bg-white text-primary hover:bg-white/90"
        >
          Tìm hiểu thêm
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach) => (
          <li key={coach.id} className="rounded-xl bg-white p-4">
            <article className="flex items-center gap-4">
              <Image
                src={coach.image || "/placeholder.svg"}
                alt={coach.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <span className="text-sm text-grayscale-40">{coach.title}</span>
                <h3 className="text-lg font-semibold text-grayscale-90">{coach.name}</h3>
                <p className="text-sm text-primary">{coach.experience}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

