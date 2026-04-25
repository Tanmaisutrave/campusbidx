import { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime));

  function getTimeLeft(end) {
    const diff = new Date(end) - new Date();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!timeLeft) {
    return <span className="text-red-500 font-semibold text-sm">Auction Ended</span>;
  }

  if (compact) {
    return (
      <span className="text-primary-600 font-semibold text-sm">
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}h{' '}
        {String(timeLeft.minutes).padStart(2, '0')}m{' '}
        {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    );
  }

  const Box = ({ value, label }) => (
    <div className="flex flex-col items-center bg-primary-50 rounded-xl px-4 py-2 min-w-[60px]">
      <span className="text-2xl font-bold text-primary-700">{String(value).padStart(2, '0')}</span>
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-2">
      {timeLeft.days > 0 && <Box value={timeLeft.days} label="Days" />}
      <Box value={timeLeft.hours} label="Hours" />
      <Box value={timeLeft.minutes} label="Mins" />
      <Box value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default CountdownTimer;
