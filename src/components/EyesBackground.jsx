import React from 'react';

/**
 * Candy-pink background with cartoon eye emoji pairs and twinkling 4-point yellow/white stars,
 * matching the user's reference image.
 */
export default function EyesBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#ff9eb5]">
      {/* Repeating SVG Pattern of Eye Pairs & Twinkling Stars */}
      <svg
        className="w-full h-full opacity-90"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="pinkEyesPattern"
            width="260"
            height="320"
            patternUnits="userSpaceOnUse"
          >
            {/* 4-point Yellow & White Stars (fairy dust) */}
            {/* Star 1 - Yellow */}
            <path
              d="M 40 45 Q 40 55 50 55 Q 40 55 40 65 Q 40 55 30 55 Q 40 55 40 45 Z"
              fill="#fef08a"
              opacity="0.9"
            />
            <circle cx="40" cy="55" r="1.5" fill="#ffffff" />

            {/* Star 2 - White */}
            <path
              d="M 190 35 Q 190 43 198 43 Q 190 43 190 51 Q 190 43 182 43 Q 190 43 190 35 Z"
              fill="#ffffff"
              opacity="0.85"
            />

            {/* Star 3 - Yellow */}
            <path
              d="M 130 150 Q 130 162 142 162 Q 130 162 130 174 Q 130 162 118 162 Q 130 162 130 150 Z"
              fill="#fef08a"
              opacity="0.9"
            />

            {/* Star 4 - White */}
            <path
              d="M 235 195 Q 235 203 243 203 Q 235 203 235 211 Q 235 203 227 203 Q 235 203 235 195 Z"
              fill="#ffffff"
              opacity="0.8"
            />

            {/* Star 5 - Yellow */}
            <path
              d="M 35 260 Q 35 270 45 270 Q 35 270 35 280 Q 35 270 25 270 Q 35 270 35 260 Z"
              fill="#fde047"
              opacity="0.95"
            />

            {/* Little twinkles / dust */}
            <circle cx="95" cy="85" r="2" fill="#ffffff" opacity="0.75" />
            <circle cx="165" cy="110" r="1.5" fill="#fef08a" opacity="0.8" />
            <circle cx="215" cy="140" r="2" fill="#ffffff" opacity="0.7" />
            <circle cx="75" cy="205" r="1.5" fill="#fef08a" opacity="0.8" />
            <circle cx="170" cy="255" r="2" fill="#ffffff" opacity="0.75" />

            {/* --- EYE PAIR 1 (Looking Right) --- */}
            <g transform="translate(45, 10) scale(0.95)">
              {/* Left Eye */}
              <ellipse cx="22" cy="30" rx="15" ry="22" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="26" cy="30" rx="8" ry="12" fill="#0f172a" />
              <circle cx="28" cy="25" r="3" fill="#ffffff" />
              <circle cx="25" cy="34" r="1.5" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="56" cy="30" rx="15" ry="22" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="60" cy="30" rx="8" ry="12" fill="#0f172a" />
              <circle cx="62" cy="25" r="3" fill="#ffffff" />
              <circle cx="59" cy="34" r="1.5" fill="#ffffff" />
            </g>

            {/* --- EYE PAIR 2 (Looking Left, slightly tilted) --- */}
            <g transform="translate(170, 75) rotate(-8) scale(0.85)">
              {/* Left Eye */}
              <ellipse cx="20" cy="28" rx="14" ry="20" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="15" cy="28" rx="7.5" ry="11" fill="#0f172a" />
              <circle cx="14" cy="23" r="2.8" fill="#ffffff" />
              <circle cx="17" cy="32" r="1.2" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="52" cy="28" rx="14" ry="20" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="47" cy="28" rx="7.5" ry="11" fill="#0f172a" />
              <circle cx="46" cy="23" r="2.8" fill="#ffffff" />
              <circle cx="49" cy="32" r="1.2" fill="#ffffff" />
            </g>

            {/* --- EYE PAIR 3 (Looking Up-Right, Center) --- */}
            <g transform="translate(90, 175) scale(0.9)">
              {/* Left Eye */}
              <ellipse cx="20" cy="28" rx="15" ry="22" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="24" cy="23" rx="8" ry="12" fill="#0f172a" />
              <circle cx="26" cy="19" r="3" fill="#ffffff" />
              <circle cx="23" cy="27" r="1.4" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="54" cy="28" rx="15" ry="22" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="58" cy="23" rx="8" ry="12" fill="#0f172a" />
              <circle cx="60" cy="19" r="3" fill="#ffffff" />
              <circle cx="57" cy="27" r="1.4" fill="#ffffff" />
            </g>

            {/* --- EYE PAIR 4 (Small, Looking Left) --- */}
            <g transform="translate(10, 130) rotate(5) scale(0.7)">
              <ellipse cx="20" cy="26" rx="13" ry="18" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="16" cy="26" rx="7" ry="10" fill="#0f172a" />
              <circle cx="15" cy="22" r="2.5" fill="#ffffff" />

              <ellipse cx="50" cy="26" rx="13" ry="18" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="46" cy="26" rx="7" ry="10" fill="#0f172a" />
              <circle cx="45" cy="22" r="2.5" fill="#ffffff" />
            </g>

            {/* --- EYE PAIR 5 (Bottom Right, Looking Right) --- */}
            <g transform="translate(180, 240) scale(0.95)">
              <ellipse cx="22" cy="30" rx="15" ry="22" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="26" cy="30" rx="8" ry="12" fill="#0f172a" />
              <circle cx="28" cy="25" r="3" fill="#ffffff" />
              <circle cx="25" cy="34" r="1.5" fill="#ffffff" />

              <ellipse cx="56" cy="30" rx="15" ry="22" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="60" cy="30" rx="8" ry="12" fill="#0f172a" />
              <circle cx="62" cy="25" r="3" fill="#ffffff" />
              <circle cx="59" cy="34" r="1.5" fill="#ffffff" />
            </g>

            {/* --- EYE PAIR 6 (Bottom Left, Looking Straight/Slight Up) --- */}
            <g transform="translate(45, 275) scale(0.8)">
              <ellipse cx="20" cy="26" rx="14" ry="20" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="21" cy="24" rx="7.5" ry="11" fill="#0f172a" />
              <circle cx="23" cy="20" r="2.8" fill="#ffffff" />

              <ellipse cx="52" cy="26" rx="14" ry="20" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <ellipse cx="53" cy="24" rx="7.5" ry="11" fill="#0f172a" />
              <circle cx="55" cy="20" r="2.8" fill="#ffffff" />
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#pinkEyesPattern)" />
      </svg>
    </div>
  );
}
