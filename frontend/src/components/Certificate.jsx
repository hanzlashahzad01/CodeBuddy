import React, { useRef } from 'react';
import { Download, Award, ShieldCheck } from 'lucide-react';

const Certificate = ({ studentName, courseTitle, completionDate }) => {
  const canvasRef = useRef(null);

  const drawAndDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Reset size to high-resolution for printing (1920x1080)
    canvas.width = 1920;
    canvas.height = 1080;

    // Background Gradient (Deep elegant dark-blue to dark-slate)
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, '#0f172a'); // slate-900
    bgGrad.addColorStop(1, '#020617'); // slate-950
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative outer border (Gold color)
    ctx.strokeStyle = '#d97706'; // amber-600
    ctx.lineWidth = 15;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Decorative inner thin border (Amber Gold)
    ctx.strokeStyle = '#f59e0b'; // amber-500
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Corner decorative lines
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(60, 60, 80, 8); // Top-left horizontal
    ctx.fillRect(60, 60, 8, 80); // Top-left vertical
    ctx.fillRect(canvas.width - 140, 60, 80, 8); // Top-right horizontal
    ctx.fillRect(canvas.width - 68, 60, 8, 80); // Top-right vertical
    ctx.fillRect(60, canvas.height - 68, 80, 8); // Bottom-left horizontal
    ctx.fillRect(60, canvas.height - 140, 8, 80); // Bottom-left vertical
    ctx.fillRect(canvas.width - 140, canvas.height - 68, 80, 8); // Bottom-right horizontal
    ctx.fillRect(canvas.width - 68, canvas.height - 140, 8, 80); // Bottom-right vertical

    // Header Logo/Text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('CODEBUDDY ACADEMY', canvas.width / 2, 160);

    // Verified Certificate label
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = 'semibold 22px sans-serif';
    ctx.fillText('VERIFIED CERTIFICATE OF COMPLETION', canvas.width / 2, 210);

    // Certificate Body Description
    ctx.fillStyle = '#e2e8f0'; // slate-200
    ctx.font = 'italic 28px sans-serif';
    ctx.fillText('This is proudly presented to', canvas.width / 2, 330);

    // Student Name (Elegant Serif look in Gold)
    ctx.fillStyle = '#fbbf24'; // amber-400
    ctx.font = 'bold 70px serif';
    ctx.fillText(studentName, canvas.width / 2, 440);

    // Completion statement text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '28px sans-serif';
    ctx.fillText('for successfully mastering all lectures and practical projects in the course:', canvas.width / 2, 540);

    // Course Title (Clean sans-serif)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'extrabold 48px sans-serif';
    ctx.fillText(courseTitle, canvas.width / 2, 630);

    // Date
    const formattedDate = completionDate
      ? new Date(completionDate).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Completed on ${formattedDate}`, canvas.width / 2, 730);

    // Draw Gold Medal Emblem (using circles and ribbon graphics)
    const medalX = canvas.width / 2;
    const medalY = 880;

    // Ribbons
    ctx.fillStyle = '#ef4444'; // Red Ribbon 1
    ctx.beginPath();
    ctx.moveTo(medalX - 30, medalY);
    ctx.lineTo(medalX - 60, medalY + 100);
    ctx.lineTo(medalX - 25, medalY + 90);
    ctx.lineTo(medalX, medalY);
    ctx.fill();

    ctx.fillStyle = '#b91c1c'; // Red Ribbon 2 (darker)
    ctx.beginPath();
    ctx.moveTo(medalX, medalY);
    ctx.lineTo(medalX + 25, medalY + 90);
    ctx.lineTo(medalX + 60, medalY + 100);
    ctx.lineTo(medalX + 30, medalY);
    ctx.fill();

    // Medal outer glow
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(medalX, medalY, 55, 0, Math.PI * 2);
    ctx.fill();

    // Medal inner circle
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(medalX, medalY, 45, 0, Math.PI * 2);
    ctx.fill();

    // Medal star text/graphic
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('★', medalX, medalY + 12);

    // Signatures
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    // Left: Instructor Line
    ctx.beginPath();
    ctx.moveTo(250, medalY + 20);
    ctx.lineTo(450, medalY + 20);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 24px serif';
    ctx.fillText('Hanzla Shahzad', 350, medalY - 5);
    ctx.font = '16px sans-serif';
    ctx.fillText('Lead Instructor', 350, medalY + 45);

    // Right: Director Line
    ctx.beginPath();
    ctx.moveTo(canvas.width - 450, medalY + 20);
    ctx.lineTo(canvas.width - 250, medalY + 20);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 24px serif';
    ctx.fillText('CodeBuddy Team', canvas.width - 350, medalY - 5);
    ctx.font = '16px sans-serif';
    ctx.fillText('Director Academy', canvas.width - 350, medalY + 45);

    // Trigger image download
    const link = document.createElement('a');
    link.download = `CodeBuddy-Certificate-${studentName.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 text-center max-w-lg mx-auto shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Visual top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-yellow-600" />
      
      <Award className="w-16 h-16 text-amber-500 mx-auto mb-4 drop-shadow" />
      <h3 className="text-2xl font-black text-[var(--color-text-main)] mb-2">Claim Your Certificate</h3>
      <p className="text-[var(--color-text-muted)] text-sm mb-6 leading-relaxed">
        Congratulations! You have completed all videos in this playlist. Download your official CodeBuddy completion certificate to share on LinkedIn or with employers.
      </p>

      {/* Hidden canvas used for high-res generation */}
      <canvas ref={canvasRef} className="hidden" />

      <button
        onClick={drawAndDownload}
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-lg cursor-pointer"
      >
        <Download className="w-5 h-5" /> Download Certificate 🏆
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-muted)] mt-4">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Verified Certificate • Free of Cost</span>
      </div>
    </div>
  );
};

export default Certificate;
