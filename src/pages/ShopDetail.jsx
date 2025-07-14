import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, Clock, Phone, Calendar, 
  ChevronLeft, Image, MessageSquare, Map, X,
  TrendingUp, User, Award, Eye, Plus
} from 'lucide-react';
import { generateShops } from '../data/dataLoader';
import GoldDecorations from '../components/GoldDecorations';

const ShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    username: '',
    comment: '',
    rating: 5
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const shops = generateShops();
    const foundShop = shops.find(s => s.id === parseInt(id));
    setShop(foundShop);
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 fill-yellow-500/50 text-yellow-500" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-600" />);
    }
    
    return stars;
  };

  const handleReviewFormChange = (field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateReviewForm = () => {
    const errors = {};
    
    if (!reviewForm.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!reviewForm.comment.trim()) {
      errors.comment = 'Feedback is required';
    } else if (reviewForm.comment.trim().length < 10) {
      errors.comment = 'Feedback must be at least 10 characters';
    }
    
    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
    
    return errors;
  };

  const handleSubmitReview = () => {
    const errors = validateReviewForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Create new review
    const newReview = {
      id: `${shop.id}-${Date.now()}`,
      username: reviewForm.username.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      date: 'Just now'
    };
    
    // Add review to shop
    setShop(prevShop => ({
      ...prevShop,
      reviews: [newReview, ...prevShop.reviews]
    }));
    
    // Reset form
    setReviewForm({
      username: '',
      comment: '',
      rating: 5
    });
    setFormErrors({});
    setShowReviewForm(false);
  };

  const renderRatingSelector = () => {
    return (
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleReviewFormChange('rating', star)}
            className="transition-colors"
          >
            <Star 
              className={`w-6 h-6 ${
                star <= reviewForm.rating 
                  ? 'fill-yellow-500 text-yellow-500' 
                  : 'text-gray-600 hover:text-yellow-400'
              }`} 
            />
          </button>
        ))}
        <span className="text-sm text-gray-400 ml-2">
          {reviewForm.rating} {reviewForm.rating === 1 ? 'star' : 'stars'}
        </span>
      </div>
    );
  };

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading shop details...</p>
        </div>
      </div>
    );
  }

  const priceHistory = [
    { date: '2024-01-15', price916: shop.goldPrices.price916 - 2.5, price999: shop.goldPrices.price999 - 2.8 },
    { date: '2024-01-16', price916: shop.goldPrices.price916 - 1.2, price999: shop.goldPrices.price999 - 1.5 },
    { date: '2024-01-17', price916: shop.goldPrices.price916 - 0.8, price999: shop.goldPrices.price999 - 1.0 },
    { date: '2024-01-18', price916: shop.goldPrices.price916, price999: shop.goldPrices.price999 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <GoldDecorations />
      
      <div className="relative z-10 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/shops"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to All Shops</span>
          </Link>

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-yellow-500/20">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Shop Image */}
              <div className="lg:w-1/3">
                <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden">
                  <img
                    src={shop.profileImage}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Shop Info */}
              <div className="lg:w-2/3">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">
                      {shop.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{shop.district}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{shop.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{shop.hours}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">{shop.address}</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-green-900/30 px-3 py-1 rounded-full">
                    <div className="flex">{renderStars(shop.rating)}</div>
                    <span className="text-sm text-green-400 ml-1">{shop.rating}</span>
                  </div>
                </div>

                {/* Gold Prices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">916 Gold</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-gray-400 bg-yellow-600/20 px-2 py-1 rounded">916 Gold</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-500 font-mono">${shop.goldPrices.price916}</div>
                    <div className="text-sm text-gray-500">/gram</div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-4 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">999 Gold</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-gray-400 bg-yellow-600/20 px-2 py-1 rounded">999 Gold</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-500 font-mono">${shop.goldPrices.price999}</div>
                    <div className="text-sm text-gray-500">/gram</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated {shop.goldPrices.lastUpdated} by {shop.goldPrices.updatedBy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg border border-yellow-500/20 mb-6">
              {[
                { id: 'gallery', label: 'Gallery', icon: Image },
                { id: 'reviews', label: 'Reviews', icon: MessageSquare },
                { id: 'map', label: 'Map View', icon: Map }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-yellow-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
              {activeTab === 'gallery' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Shop Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shop.galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          setSelectedImage(index);
                          setShowLightbox(true);
                        }}
                      >
                        <img
                          src={image}
                          alt={`${shop.name} gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Customer Reviews</h3>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Review</span>
                    </button>
                  </div>

                  {/* Add Review Form */}
                  {showReviewForm && (
                    <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
                      <h4 className="text-lg font-semibold text-white mb-4">Write a Review</h4>
                      
                      <div className="space-y-4">
                        {/* Username Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={reviewForm.username}
                            onChange={(e) => handleReviewFormChange('username', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                              formErrors.username ? 'border-red-500' : 'border-gray-600'
                            }`}
                            placeholder="Enter your name"
                          />
                          {formErrors.username && (
                            <p className="text-red-400 text-sm mt-1">{formErrors.username}</p>
                          )}
                        </div>

                        {/* Rating Selector */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Rating
                          </label>
                          {renderRatingSelector()}
                          {formErrors.rating && (
                            <p className="text-red-400 text-sm mt-1">{formErrors.rating}</p>
                          )}
                        </div>

                        {/* Feedback Textarea */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Feedback
                          </label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => handleReviewFormChange('comment', e.target.value)}
                            rows={4}
                            className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none ${
                              formErrors.comment ? 'border-red-500' : 'border-gray-600'
                            }`}
                            placeholder="Share your experience with this shop..."
                          />
                          {formErrors.comment && (
                            <p className="text-red-400 text-sm mt-1">{formErrors.comment}</p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSubmitReview}
                            className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition-all"
                          >
                            Submit Review
                          </button>
                          <button
                            onClick={() => {
                              setShowReviewForm(false);
                              setReviewForm({ username: '', comment: '', rating: 5 });
                              setFormErrors({});
                            }}
                            className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {shop.reviews.map((review, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-black" />
                            </div>
                            <span className="font-medium text-white">{review.username}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-400">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Location</h3>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={shop.mapImage}
                      alt={`${shop.name} location map`}
                      className="w-full h-64 object-cover"
                    />
                    <p className="text-sm text-gray-500 mt-2">{shop.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price History */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Price History</h3>
            <div className="space-y-2">
              {priceHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">{entry.date}</span>
                  <div className="flex space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">916 Gold</div>
                      <div className="text-yellow-500 font-mono">${entry.price916}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">999 Gold</div>
                      <div className="text-yellow-500 font-mono">${entry.price999}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl max-h-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-medium">Shop Gallery</h4>
              <button
                onClick={() => setShowLightbox(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={shop.galleryImages[selectedImage]}
              alt={`${shop.name} gallery`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDetail;