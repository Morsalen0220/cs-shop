interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,17,17,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="rounded-2xl bg-[#111111] p-3 text-white shadow-[0_12px_24px_rgba(17,17,17,0.12)]">{icon}</div>
      </div>
      <p className="mt-6 text-3xl font-semibold tracking-tight text-[#111111]">{value}</p>
    </div>
  );
};

export default StatCard;
