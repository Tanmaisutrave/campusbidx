import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionService } from '../services/api';

const CATEGORIES = ['Books', 'Gadgets', 'Accessories', 'Clothing', 'Other'];
const DURATIONS = [
  { label: '1 Day', value: 1 },
  { label: '3 Days', value: 3 },
  { label: '5 Days', value: 5 },
  { label: '7 Days', value: 7 },
];

// Defined OUTSIDE component to prevent remount on every render
const InputField = ({ label, value, onChange, error, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${error ? 'border-red-400' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const TextareaField = ({ label, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      rows={4}
      placeholder={`Enter ${label.toLowerCase()}`}
      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${error ? 'border-red-400' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const CreateAuction = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: '', startingPrice: '', duration: 3, image: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState('');

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.startingPrice || Number(form.startingPrice) <= 0) e.startingPrice = 'Enter a valid starting price';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await auctionService.create({ ...form, startingPrice: Number(form.startingPrice) });
      setSuccess(true);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Failed to create auction' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <span className="text-6xl">🎉</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Auction Submitted!</h2>
          <p className="text-gray-500 mt-2">Your auction is pending admin approval. You'll be notified once it's live.</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
              Go Home
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setForm({ title: '', description: '', category: '', startingPrice: '', duration: 3, image: '' });
                setPreview('');
              }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create Auction</h1>
        <p className="text-gray-500 text-sm mt-1">List your item for auction. It will go live after admin approval.</p>
      </div>

      {errors.api && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">{errors.api}</div>
      )}

      <div className="bg-white rounded-2xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          <InputField
            label="Item Name"
            value={form.title}
            onChange={handleChange('title')}
            error={errors.title}
          />

          <TextareaField
            label="Description"
            value={form.description}
            onChange={handleChange('description')}
            error={errors.description}
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={handleChange('category')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white ${errors.category ? 'border-red-400' : 'border-gray-300'}`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Starting Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={form.startingPrice}
                onChange={handleChange('startingPrice')}
                className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.startingPrice ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="0"
                min="1"
              />
            </div>
            {errors.startingPrice && <p className="text-red-500 text-xs mt-1">{errors.startingPrice}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Auction Duration</label>
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, duration: d.value }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.duration === d.value
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${preview ? 'border-primary-400' : 'border-gray-300 hover:border-primary-400'}`}>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreview(''); setForm((prev) => ({ ...prev, image: '' })); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <span className="text-3xl">📷</span>
                  <p className="text-gray-500 text-sm mt-2">Click to upload image</p>
                  <p className="text-gray-400 text-xs">PNG, JPG up to 5MB</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
            ⚠️ Your auction will be reviewed by an admin before going live.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;
