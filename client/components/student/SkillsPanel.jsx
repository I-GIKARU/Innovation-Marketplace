// components/SkillsPanel.js
"use client";

export default function SkillsPanel() {
  return (
    <div className="w-60 p-4 bg-white rounded-xl shadow">
      <h3 className="font-bold text-xl mb-4 border-b pb-2">Skills</h3>
      <div className="mb-2">
        <span className="font-semibold">Frontend:</span> HTML, JavaScript, CSS,
        ReactJs, NextJs
      </div>
      <div className="mb-2">
        <span className="font-semibold">Backend:</span> SQL, Flask, Django
      </div>
      <div>
        <span className="font-semibold">Tools:</span> VSCode, Git, GitHub
      </div>
    </div>
  );
}
