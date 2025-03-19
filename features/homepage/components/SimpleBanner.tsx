import Image from 'next/image';

export default function SimpleBanner() {
  return (
    <section className="w-full bg-background">
      {/* Desktop Banner */}
      <div className="hidden md:block w-full">
        <Image
          priority
          alt="Hero Banner"
          className="w-full object-cover"
          height={400}
          sizes="(max-width: 1024px) 90vw, 1200px"
          src="https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/1610x492_Banner_WEB_f660825f26.png"
          width={1200}
        />
      </div>

      {/* Mobile Banner - You can add a mobile-specific banner here if needed */}
      <div className="md:hidden w-full">
        <Image
          priority
          alt="Hero Banner"
          className="w-full object-cover"
          height={300}
          sizes="100vw"
          src="https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/1610x492_Banner_WEB_f660825f26.png"
          width={600}
        />
      </div>
    </section>
  );
}
