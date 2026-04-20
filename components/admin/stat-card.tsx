interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="rounded-md border bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <div className="text-gray-500">{icon}</div>
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
