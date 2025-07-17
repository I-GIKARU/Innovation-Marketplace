// components/ProjectCard.js
"use client";
import Image from "next/image";

export default function ProjectCard({ title, description, image, bgColor }) {
  return (
    <div className={`rounded-xl p-4 ${bgColor} shadow-md`}>
      <h2 className="font-bold mb-2">{title}</h2>
      <div className="flex gap-2">
        <div className="flex-1 text-sm">{description}</div>
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="rounded-xl"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Image
            src="/images/profile.jpg"
            alt="profile"
            width={24}
            height={24}
            className="rounded-full"
          />
          <button className="text-xl font-bold">+</button>
        </div>
        <button className="bg-white px-3 py-1 rounded-full text-sm font-medium">
          View more
        </button>
      </div>
    </div>
  );
}
