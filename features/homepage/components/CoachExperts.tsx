"use client"

import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

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
    <section className="rounded-2xl bg-gradient-3 p-8">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-semibold text-white">Coach tư vấn chăm sóc sức khỏe</h2>
        <p className="mb-4 text-white/90 text-base font-medium">
          Danh sách các Coach tư vấn chăm sóc sức khỏe của Elela
        </p>
        <Button
          variant="secondary"
          className="flex !rounded-full items-center gap-2 bg-white text-primary-5 hover:bg-white/90"
        >
          Tìm hiểu thêm
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach) => (
          <div key={coach.id} className="rounded-xl bg-white p-4">
            <div className="flex items-center gap-4">
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
                <p className="text-sm text-primary-5">{coach.experience}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
