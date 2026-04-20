interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(17,17,17,0.05)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="rounded-2xl bg-[#fff3ed] p-3 text-[#ff5a1f]">{icon}</div>
      </div>
      <p className="mt-6 text-3xl font-bold tracking-tight text-[#111111]">{value}</p>
    </div>
  );
};

export default StatCard;
