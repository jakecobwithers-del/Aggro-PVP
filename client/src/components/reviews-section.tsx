import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Review {
  id: number;
  playerName: string;
  rating: number;
  comment: string;
  playtime: string | null;
  createdAt: string;
}

export default function ReviewsSection() {
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    playerName: '',
    rating: 5,
    comment: '',
    playtime: ''
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ['/api/reviews'],
    queryFn: async () => {
      const response = await fetch('/api/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
    refetchInterval: 15000, // Update every 15 seconds
    refetchOnWindowFocus: true,
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) {
        throw new Error('Failed to create review');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      setNewReview({ playerName: '', rating: 5, comment: '', playtime: '' });
      setShowForm(false);
    }
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.playerName || !newReview.comment) return;

    createReviewMutation.mutate({
      playerName: newReview.playerName,
      rating: newReview.rating,
      comment: newReview.comment,
      playtime: newReview.playtime || null
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
      ></i>
    ));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-gray-900 to-black scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-6">
            <span className="text-red-600">PLAYER</span> REVIEWS
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(parseFloat(averageRating)))}
              <span className="text-2xl font-rajdhani font-bold text-white">{averageRating}</span>
            </div>
            <span className="text-gray-400">({reviews.length} reviews)</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="bg-gray-800/50 p-8 rounded-xl border border-red-600/30 text-center">
                <i className="fas fa-star text-4xl text-gray-600 mb-4"></i>
                <h3 className="text-xl font-rajdhani font-bold text-gray-400 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500">Be the first to leave a review about your experience on Aggro PVP!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-gray-800/50 p-6 rounded-xl border border-red-600/30 cursor-pointer hover:bg-gray-800/70 transition-colors group"
                  onClick={() => setSelectedReview(review)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-rajdhani font-bold text-white group-hover:text-red-400 transition-colors">{review.playerName}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-gray-400 text-sm">• {formatDate(review.createdAt)}</span>
                        {review.playtime && <span className="text-gray-400 text-sm">• {review.playtime} played</span>}
                      </div>
                    </div>
                    <i className="fas fa-chevron-right text-gray-600 group-hover:text-red-400 transition-colors"></i>
                  </div>
                  <p className="text-gray-300 leading-relaxed line-clamp-3">{review.comment}</p>
                  <div className="mt-3 text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to read full review
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-red-600/30 sticky top-8">
              <h3 className="text-2xl font-rajdhani font-bold text-white mb-6">Leave a Review</h3>
              
              {!showForm ? (
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-rajdhani font-bold"
                >
                  <i className="fas fa-star mr-2"></i>
                  Write Review
                </Button>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <Input
                    placeholder="Your player name"
                    value={newReview.playerName}
                    onChange={(e) => setNewReview(prev => ({ ...prev, playerName: e.target.value }))}
                    className="bg-black/50 border-gray-600 text-white"
                    required
                  />
                  
                  <Input
                    placeholder="Hours played (optional)"
                    value={newReview.playtime}
                    onChange={(e) => setNewReview(prev => ({ ...prev, playtime: e.target.value }))}
                    className="bg-black/50 border-gray-600 text-white"
                  />

                  <div>
                    <label className="block text-gray-300 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                          className={`text-2xl ${i < newReview.rating ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-400 transition-colors`}
                        >
                          <i className="fas fa-star"></i>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    placeholder="Share your experience on the server..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="bg-black/50 border-gray-600 text-white min-h-[100px] resize-none"
                    required
                  />

                  <div className="flex space-x-2">
                    <Button 
                      type="submit"
                      disabled={createReviewMutation.isPending}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-rajdhani font-bold disabled:opacity-50"
                    >
                      {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
              
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Help other players find our server by leaving an honest review
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Detail Modal */}
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="bg-gray-900 border-red-600/30 text-white max-w-2xl">
            {selectedReview && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-rajdhani font-bold text-red-400">
                    Review by {selectedReview.playerName}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Player review details and rating
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {renderStars(selectedReview.rating)}
                      <span className="text-yellow-400 font-bold">{selectedReview.rating}/5</span>
                    </div>
                    <span className="text-gray-400">• {formatDate(selectedReview.createdAt)}</span>
                    {selectedReview.playtime && (
                      <span className="text-gray-400">• {selectedReview.playtime} played</span>
                    )}
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-red-600/20">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedReview.comment}
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}