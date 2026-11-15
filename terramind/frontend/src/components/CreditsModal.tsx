import React from 'react';
import { X, Award, Users, Crown, Sparkles, ExternalLink, Heart } from 'lucide-react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  badge?: string;
  isLeader?: boolean;
  contribution: string;
  color: string;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const team: TeamMember[] = [
    {
      name: 'Mert',
      role: 'Team Leader',
      badge: 'Team Leader',
      isLeader: true,
      contribution: 'Led our team, organized the project, and helped connect the backend and algorithms.',
      color: 'from-[#7C9A6B]/25 to-[#7C9A6B]/5 border-[#7C9A6B]/50'
    },
    {
      name: 'Zeynep',
      role: 'Student Developer',
      badge: 'Student',
      isLeader: false,
      contribution: 'Worked on the frontend design, buttons, and making the website easy to use.',
      color: 'from-sky-500/15 to-transparent border-sky-500/25'
    },
    {
      name: 'Anka',
      role: 'Student Developer',
      badge: 'Student',
      isLeader: false,
      contribution: 'Helped research NASA climate data, satellite NDVI, and crop information.',
      color: 'from-amber-500/15 to-transparent border-amber-500/25'
    },
    {
      name: 'Aras',
      role: 'Student Developer',
      badge: 'Student',
      isLeader: false,
      contribution: 'Worked on the map coordinates, testing features, and checking for bugs.',
      color: 'from-emerald-500/15 to-transparent border-emerald-500/25'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 anim-fade-in">
      <div className="dark-glass-panel rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative border border-white/[0.08] anim-scale-in text-xs">
        {/* Close button */}
        <button
          onClick={onClose}
          className="btn absolute top-5 right-5 text-white/40 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Close credits"
        >
          <X size={16} />
        </button>

        {/* Challenge Pill Header */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#7C9A6B] uppercase tracking-wider mb-2">
          <Award size={15} className="text-[#A8C496]" />
          <span>NASA Space Apps Challenge 2026</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
          Made by Students 🎓
        </h2>

        <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
          We are four students who built <strong>Farmelster</strong> for the <em>NASA Space Apps Challenge 2026</em>. 
          We tried our best to make something simple and useful for farmers using real NASA satellite data!
        </p>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
          {team.map((member) => (
            <div
              key={member.name}
              className={`p-4 rounded-2xl border bg-gradient-to-br ${member.color} bg-white/[0.02] flex flex-col justify-between transition-all hover:border-white/30`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {member.isLeader ? (
                      <span className="p-1 rounded-lg bg-[#7C9A6B]/20 text-[#A8C496]">
                        <Crown size={14} className="fill-[#7C9A6B]/40 text-[#7C9A6B]" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-lg bg-white/[0.05] text-white/60">
                        <Users size={14} />
                      </span>
                    )}
                    <h3 className="text-base font-bold text-white">
                      {member.name}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      member.isLeader
                        ? 'bg-[#7C9A6B] text-[#0E0F12] shadow-sm font-bold'
                        : 'bg-white/[0.06] text-white/70 border border-white/[0.08]'
                    }`}
                  >
                    {member.badge}
                  </span>
                </div>

                <div className="text-xs font-medium text-white/85 mb-1.5">
                  {member.role}
                </div>

                <p className="text-[11px] text-white/60 leading-relaxed">
                  {member.contribution}
                </p>
              </div>

              {member.isLeader && (
                <div className="mt-3 pt-2.5 border-t border-[#7C9A6B]/20 flex items-center justify-between text-[10px] text-[#A8C496] font-medium">
                  <span>Our Team Leader</span>
                  <Sparkles size={12} className="text-[#A8C496]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Student Note Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs text-white/70 leading-relaxed">
          <Heart size={16} className="text-[#C47B6A] shrink-0 mt-0.5 fill-[#C47B6A]/30" />
          <div>
            <strong className="text-white/90 block font-semibold mb-0.5">Thank You!</strong>
            <span>
              We are still learning and had a lot of fun making this project together. Thank you for checking out Farmelster!
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>&copy; 2026 Farmelster &bull; Open Agricultural Intelligence</span>
          <button
            onClick={onClose}
            className="btn px-4 py-2 bg-[#7C9A6B] hover:bg-[#6E8A5D] text-[#0E0F12] font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

