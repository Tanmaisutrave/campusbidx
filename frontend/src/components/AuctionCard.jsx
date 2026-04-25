import { useNavigate } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

const PLACEHOLDER_IMG = 'https://placehold.co/400x250/ea580c/ffffff?text=No+Image';

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();
  const { _id, title, startingPrice, currentBid, endTime, image, category, status } = auction;

  const statusColor = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    ended: 'bg-red-100 text-red-700',
    rejected: 'bg-gray-100 text-gray-600',
  };

  return (
    <div
      onClick={() => navigate(`/auction/${_id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={image || PLACEHOLDER_IMG}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
        />
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${statusColor[status] || statusColor.pending}`}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </span>
        {category && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-base truncate mb-2">{title}</h3>
        <div className="flex justify-between items-center text-sm mb-3">
          <div>
            <p className="text-gray-500 text-xs">Starting</p>
            <p className="font-medium text-gray-700">₹{startingPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">Current Bid</p>
            <p className="font-bold text-primary-600 text-base">₹{currentBid || startingPrice}</p>
          </div>
        </div>
        <div className="border-t pt-3">
          <p className="text-xs text-gray-500 mb-1">Ends in</p>
          <CountdownTimer endTime={endTime} compact />
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
