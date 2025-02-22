import Link from 'next/link';
import Image from 'next/image';

const getMediaUrl = (id: string) => {
  // La URL base puede variar según tu entorno
  const baseUrl = '/api/media';
  return `${baseUrl}/${id}`;
}

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors">
          <Image src="/api/media/file/icons8-concert-day-96.png" alt="Conciertapp" width={32} height={32} />
          <span className="text-xl font-semibold">Conciertapp</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;