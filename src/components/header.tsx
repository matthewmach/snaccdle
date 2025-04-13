import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      {/* Left Image
      <a href="https://left-link.com">
        <img
          src="/left-icon.png"
          alt="Left Icon"
          className="w-8 h-8 hover:opacity-80 transition"
        />
      </a> */}

      {/* Centered Title */}
      <h1 className="text-5xl font-semibold text-center flex-1">
        Snaccdle
      </h1>

      {/* Right Image
      <a href="https://right-link.com">
        <img
          src="/right-icon.png"
          alt="Right Icon"
          className="w-8 h-8 hover:opacity-80 transition"
        />
      </a> */}
    </header>
  );
};

export default Header;
