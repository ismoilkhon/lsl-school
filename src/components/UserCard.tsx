const UserCard = ({ type, count, label }: { type: string; count?: number; label?: string }) => {
  const displayLabel = label || `${type}s`;
  const displayCount = typeof count === 'number' ? count.toLocaleString() : '—';
  return (
    <div className="rounded-2xl odd:bg-blue-200 even:bg-blue-300 dark:odd:bg-blue-700 dark:even:bg-blue-600 p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full text-blue-700 dark:text-blue-200">
          2024/25
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4 text-blue-800 dark:text-blue-100">{displayCount}</h1>
      <h2 className="capitalize text-sm font-medium text-blue-700 dark:text-blue-200">{displayLabel}</h2>
    </div>
  );
};

export default UserCard;
