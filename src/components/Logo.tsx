import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showSubtitle?: boolean;
}

export default function Logo({ className = '', size = 120, showSubtitle = true }: LogoProps) {
  // We render the beautiful comprehensive vector circular emblem from the design.
  // It matches the handwriting text "Girija Millets", golden grains on left, green leaves on right, flower at base.
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-all hover:scale-105 duration-500 ease-out"
        id="girija-premium-vector-logo"
      >
        {/* Soft elegant cloud/watercolor back glow */}
        <circle cx="100" cy="100" r="82" fill="#FDFCF8" />
        <circle cx="100" cy="100" r="76" fill="#FAF7EF" fillOpacity="0.5" />
        
        {/* Delicate golden circular double rings framing the botanical elements */}
        <circle cx="100" cy="100" r="78" stroke="#DFB96C" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="180 8" />
        <circle cx="100" cy="100" r="75" stroke="#DFB96C" strokeWidth="0.6" strokeDasharray="4 4" strokeOpacity="0.7" />

        {/* --- LEFT SIDE: GOLDEN WHEAT & GRAIN WREATH --- */}
        {/* Main Wheat Spine */}
        <path
          d="M 54 165 C 34 145 22 115 32 80 C 37 60 52 44 71 35"
          stroke="#C2923F"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Golden wheat kernels with beautiful rotation styling */}
        <g id="wheat-kernels-left">
          {/* Base bottom kernel */}
          <path d="M 48 152 C 40 156 34 150 44 144 C 47 146 50 148 48 152 Z" fill="#D4AF37" stroke="#C2923F" strokeWidth="0.5" />
          {/* Stalk nodes upwards */}
          <path d="M 39 135 C 31 140 26 132 36 126 C 39 128 42 131 39 135 Z" fill="#D4AF37" stroke="#C2923F" strokeWidth="0.5" />
          <path d="M 35 120 C 25 123 22 114 31 110 C 34 112 37 115 35 120 Z" fill="#E5A93B" stroke="#C2923F" strokeWidth="0.5" />
          <path d="M 31 103 C 21 105 18 96 27 92 C 30 94 33 97 31 103 Z" fill="#E5A93B" stroke="#C2923F" strokeWidth="0.5" />
          <path d="M 30 86 C 20 86 19 76 28 74 C 30 77 32 81 30 86 Z" fill="#F4C430" stroke="#C2923F" strokeWidth="0.5" />
          <path d="M 33 69 C 24 67 24 57 32 56 C 34 59 36 63 33 69 Z" fill="#F4C430" stroke="#C2923F" strokeWidth="0.5" />
          <path d="M 40 54 C 32 49 35 40 42 41 C 43 45 44 49 40 54 Z" fill="#F4C430" stroke="#C2923F" strokeWidth="0.5" />
          <path d="M 50 42 C 43 35 48 27 54 30 C 54 34 53 38 50 42 Z" fill="#F4C430" stroke="#C2923F" strokeWidth="0.5" />
          <path d="M 62 33 C 58 24 65 18 69 23 C 67 26 65 30 62 33 Z" fill="#F4C430" stroke="#C2923F" strokeWidth="0.5" />
        </g>

        {/* --- RIGHT SIDE: BOTANICAL GREEN LEAFY SWATH --- */}
        {/* Secondary foliage path */}
        <path
          d="M 115 33 C 145 38 172 65 168 105 C 165 130 152 148 135 162"
          stroke="#405C38"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Leaf petals along the branch */}
        <g id="leaf-foliage-right">
          {/* Top start leaf */}
          <path d="M 118 35 C 114 26 128 22 131 29 C 128 32 122 35 118 35 Z" fill="#608050" />
          <path d="M 132 41 C 132 32 145 32 144 41 C 139 43 135 44 132 41 Z" fill="#75975E" />
          <path d="M 148 52 C 151 44 162 48 157 56 C 153 56 150 55 148 52 Z" fill="#608050" />
          <path d="M 158 68 C 165 62 173 70 165 76 C 161 74 159 71 158 68 Z" fill="#75975E" />
          <path d="M 164 85 C 173 83 176 93 168 96 C 165 93 164 89 164 85 Z" fill="#608050" />
          <path d="M 163 103 C 172 105 171 116 163 116 C 160 112 161 107 163 103 Z" fill="#75975E" />
          <path d="M 157 122 C 164 128 159 137 151 133 C 152 129 154 125 157 122 Z" fill="#608050" />
          <path d="M 146 140 C 151 148 143 154 137 147 C 139 143 142 141 146 140 Z" fill="#75975E" />
        </g>

        {/* --- LOWER RIGHT ADDITIONAL MINI WHEAT BAR --- */}
        <g id="wheat-kernels-right" transform="translate(15, -5)">
          <path d="M 148 120 C 153 126 150 131 144 126 Z" fill="#DFB96C" />
          <path d="M 140 135 C 144 141 141 146 136 141 Z" fill="#E5A93B" />
          <path d="M 128 148 C 131 155 126 158 122 152 Z" fill="#DFB96C" />
        </g>

        {/* --- BOTTOM BASE FLOWER (Elegant 5-Petal yellow/gold blossom with center) --- */}
        <g id="bottom-blossom" transform="translate(100, 175)">
          {/* 5 Petals */}
          <path d="M 0 0 C -4 -10, -12 -8, -6 -2 C -12 4, -4 10, 0 0" fill="#F3BF3F" stroke="#C2923F" strokeWidth="0.4" />
          <path d="M 0 0 C 4 -10, 12 -8, 6 -2 C 12 4, 4 10, 0 0" fill="#F3BF3F" stroke="#C2923F" strokeWidth="0.4" />
          <path d="M 0 0 C -10 6, -10 14, -3 9 C 3 14, 10 6, 0 0" fill="#E2A62C" stroke="#C2923F" strokeWidth="0.4" />
          <circle cx="0" cy="-2" r="3.5" fill="#C2923F" />
          <circle cx="0" cy="-2" r="1.8" fill="#5A5A40" />
        </g>

        {/* Ambient golden and green organic dots/splatters */}
        <circle cx="85" cy="46" r="1.5" fill="#D4AF37" />
        <circle cx="70" cy="52" r="1" fill="#75975E" />
        <circle cx="135" cy="115" r="1.2" fill="#D4AF37" />
        <circle cx="125" cy="151" r="1.5" fill="#DFB96C" />
        <circle cx="110" cy="38" r="1" fill="#75975E" />
        <circle cx="95" cy="28" r="1.2" fill="#D4AF37" />

        {/* --- CENTER WRITING: "Girija Millets" --- */}
        {/* "Girija" calligraphy text */}
        <text
          x="100"
          y="85"
          textAnchor="middle"
          fill="#3D3D2F"
          style={{
            fontFamily: '"Alex Brush", "Great Vibes", cursive',
            fontSize: '40px',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}
        >
          Girija
        </text>

        {/* "Millets" calligraphy text */}
        <text
          x="100"
          y="124"
          textAnchor="middle"
          fill="#3D3D2F"
          style={{
            fontFamily: '"Alex Brush", "Great Vibes", cursive',
            fontSize: '37px',
            fontWeight: 'bold',
            letterSpacing: '0.4px'
          }}
        >
          Millets
        </text>

        {/* "PREMIUM MILLETS" label underneath with matching visual lines */}
        <path d="M 52 147 L 64 147" stroke="#C2923F" strokeWidth="1" strokeLinecap="round" />
        <text
          x="100"
          y="150"
          textAnchor="middle"
          fill="#C2923F"
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '8px',
            fontWeight: 800,
            letterSpacing: '0.12em'
          }}
        >
          PREMIUM MILLETS
        </text>
        <path d="M 136 147 L 148 147" stroke="#C2923F" strokeWidth="1" strokeLinecap="round" />
      </svg>

      {/* Side caption typography shown selectively */}
      {showSubtitle && (
        <div className="flex flex-col text-left">
          <span className="font-serif text-lg sm:text-xl font-extrabold text-[#3D3D2F] tracking-tight leading-none">
            Girija Millets
          </span>
          <span className="font-display text-xs font-bold text-[#8C7851] tracking-wider uppercase mt-1 leading-none">
            Millet & Malt Foods
          </span>
        </div>
      )}
    </div>
  );
}
