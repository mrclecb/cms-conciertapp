import { Artist } from "@/app/(frontend)/concerts/[slug]/types";


const ArtistCard: React.FC<{
    artist: Artist;
    isSelected: boolean;
    onClick: () => void;
  }> = ({ artist, isSelected, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`relative w-full aspect-[4/3] rounded-md overflow-hidden transition-all group focus:outline-none focus:ring-2 focus:ring-primary ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        aria-expanded={isSelected}
        aria-controls={`setlist-${artist.id}`}
        role="gridcell"
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-black">
          {artist.externalProfileURL && (
            <img
              src={artist.externalProfileURL}
              alt=""
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <h3 className="text-white font-normal text-sm md:text-sm">
            {artist.name}
          </h3>
        </div>
        
        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
        )}
      </button>
    );
  };

  export default ArtistCard