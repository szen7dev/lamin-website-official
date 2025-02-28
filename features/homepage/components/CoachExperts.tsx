import Image from 'next/image'
import Link from 'next/link'

export default function CoachExperts() {
  // Placeholder experts data
  const experts = [
    {
      id: 1,
      name: 'Dược sĩ Nguyễn Văn A',
      title: 'Chuyên gia dược phẩm',
      image: '/placeholder.svg?height=400&width=400',
      link: '/experts/nguyen-van-a',
      experience: '10+ năm kinh nghiệm'
    },
    {
      id: 2,
      name: 'Bác sĩ Trần Thị B',
      title: 'Chuyên khoa dinh dưỡng',
      image: '/placeholder.svg?height=400&width=400',
      link: '/experts/tran-thi-b',
      experience: '15+ năm kinh nghiệm'
    },
    {
      id: 3,
      name: 'Dược sĩ Lê Văn C',
      title: 'Tư vấn sức khỏe',
      image: '/placeholder.svg?height=400&width=400',
      link: '/experts/le-van-c',
      experience: '8+ năm kinh nghiệm'
    },
    {
      id: 4,
      name: 'Bác sĩ Phạm Thị D',
      title: 'Chuyên gia nhi khoa',
      image: '/placeholder.svg?height=400&width=400',
      link: '/experts/pham-thi-d',
      experience: '12+ năm kinh nghiệm'
    }
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {experts.map((expert) => (
        <Link href={expert.link} key={expert.id} className='group'>
          <div className='relative h-64 md:h-72 w-full overflow-hidden rounded-lg mb-3'>
            <Image
              src={expert.image || '/placeholder.svg'}
              alt={expert.name}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-300'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>
            <div className='absolute bottom-0 left-0 p-4 text-white'>
              <h3 className='font-bold text-lg'>{expert.name}</h3>
              <p className='text-sm text-gray-200'>{expert.title}</p>
            </div>
          </div>
          <div className='text-center'>
            <p className='text-primary-600 font-semibold'>
              {expert.experience}
            </p>
            <button className='mt-2 bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors'>
              Xem thêm
            </button>
          </div>
        </Link>
      ))}
    </div>
  )
}
