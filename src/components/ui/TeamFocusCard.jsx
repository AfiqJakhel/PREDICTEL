import React, { useState } from "react";
import { FiUser, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { cn } from "@/lib/utils";

export const TeamCard = React.memo(({
  member,
  index,
  hovered,
  setHovered
}) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-2xl relative bg-white/80 backdrop-blur-2xl border-2 border-cyan-200 overflow-hidden h-full w-full transition-all duration-300 ease-out shadow-xl hover:shadow-2xl",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-70"
    )}
  >
    <div className="p-8 flex flex-col items-center text-center h-full">
      {/* Gradient Overlay on Hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Avatar */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50 transition-opacity duration-300"
            style={{
              opacity: hovered === index ? 0.75 : 0.5
            }}
          />
          <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <FiUser className="text-white text-4xl" />
          </div>
        </div>

        {/* Name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2 transition-colors duration-300"
          style={{
            color: hovered === index ? "#0891b2" : "#111827"
          }}
        >
          {member.name}
        </h3>

        {/* NIM */}
        <p className="text-sm font-semibold text-cyan-600 mb-3">
          {member.nim}
        </p>

        {/* Role */}
        <p className="text-sm text-gray-600 mb-6">{member.role}</p>

        {/* Social Links */}
        <div className={cn(
          "flex items-center gap-4 transition-all duration-300",
          hovered === index ? "opacity-100 translate-y-0" : "opacity-70 translate-y-2"
        )}>
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md hover:shadow-lg"
          >
            <FiGithub className="text-lg" />
          </a>
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md hover:shadow-lg"
          >
            <FiLinkedin className="text-lg" />
          </a>
          <a
            href={`mailto:${member.email}`}
            className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md hover:shadow-lg"
          >
            <FiMail className="text-lg" />
          </a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
    </div>
  </div>
));

TeamCard.displayName = "TeamCard";

export function TeamFocusCards({ members }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
      {members.map((member, index) => (
        <TeamCard
          key={member.name}
          member={member}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}

