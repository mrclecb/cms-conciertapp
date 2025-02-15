import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors">
          <svg 
            className="w-8 h-8" 
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <path 
              d="M65,20 L65,60 C65,70 55,80 45,80 C35,80 25,70 25,60 C25,50 35,40 45,40 C48,40 51,41 53,42 L53,10 L65,20" 
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path 
              d="M75,40 Q80,50 75,60 M80,35 Q88,50 80,65" 
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xl font-semibold">Conciertapp</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;