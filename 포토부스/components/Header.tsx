import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md w-full p-4">
      <div className="container mx-auto flex flex-col items-center justify-center">
        {/* Reverted to a text-based logo as the image data was corrupted. */}
        <h1 className="text-5xl font-bold text-brand-primary font-serif tracking-widest">
          Swayn
        </h1>
        <p className="text-sm text-brand-secondary font-serif mt-1">
          Feel / Swear / Sway
        </p>
      </div>
    </header>
  );
};

export default Header;
