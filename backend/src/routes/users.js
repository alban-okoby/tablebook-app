const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const User = require('../models/User');
const Book = require('../models/Book');
const Recommendation = require('../models/Recommendation');
const { protect, optionalAuth, restrictTo } = require('../middleware/auth.middleware');

// ─── GET /api/users ───────────────────────────────────────────────────────────
// Search users
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const q = req.query.q?.trim();
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    if (q) {
      filter.$or = [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('username avatar bio favoriteGenres followers createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      users,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:username ─────────────────────────────────────────────────
// Public user profile by username
router.get('/:username', optionalAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      isActive: true,
    })
      .select('-password -resetPasswordToken -resetPasswordExpires -email')
      .populate('booksRead', 'title authors coverImage ratings.average')
      .populate('wishlist', 'title authors coverImage ratings.average')
      .populate('following', 'username avatar')
      .populate('followers', 'username avatar');

    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Check if the requesting user follows this user
    let isFollowing = false;
    if (req.user) {
      isFollowing = user.followers.some((f) => f._id.equals(req.user._id));
    }

    // Get their public recommendations
    const recommendations = await Recommendation.find({
      recommendedBy: user._id,
      visibility: 'public',
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('book', 'title authors coverImage ratings.average');

    res.json({
      user,
      isFollowing,
      recentRecommendations: recommendations,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:username/books ──────────────────────────────────────────
// A user's read books or wishlist
router.get('/:username/books', optionalAuth, async (req, res, next) => {
  try {
    const list = req.query.list === 'wishlist' ? 'wishlist' : 'booksRead';
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);

    const user = await User.findOne({ username: req.params.username, isActive: true })
      .select(`${list}`)
      .populate({
        path: list,
        select: 'title authors coverImage ratings.average genres publishedYear',
        options: {
          skip: (page - 1) * limit,
          limit,
        },
      });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ books: user[list], list });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:username/recommendations ─────────────────────────────────
// A user's public recommendations
router.get('/:username/recommendations', optionalAuth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username: req.params.username, isActive: true }).select('_id');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const visibilityFilter =
      req.user && req.user._id.equals(user._id)
        ? {} // Own profile: see all
        : { visibility: 'public' };

    const [recommendations, total] = await Promise.all([
      Recommendation.find({ recommendedBy: user._id, ...visibilityFilter })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('book', 'title authors coverImage ratings.average')
        .populate('recommendedTo', 'username avatar'),
      Recommendation.countDocuments({ recommendedBy: user._id, ...visibilityFilter }),
    ]);

    res.json({
      recommendations,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/users/:id/follow ───────────────────────────────────────────────
// Follow or unfollow a user (toggle)
router.post('/:id/follow', protect, async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot follow yourself.' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser || !targetUser.isActive) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      // Follow
      currentUser.following.addToSet(targetUser._id);
      targetUser.followers.addToSet(currentUser._id);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({
      following: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:username/stats ──────────────────────────────────────────
// User activity statistics
router.get('/:username/stats', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username, isActive: true }).select(
      'booksRead wishlist following followers'
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const [recommendationsGiven, recommendationsReceived] = await Promise.all([
      Recommendation.countDocuments({ recommendedBy: user._id }),
      Recommendation.countDocuments({ recommendedTo: user._id }),
    ]);

    res.json({
      stats: {
        booksRead: user.booksRead.length,
        wishlistCount: user.wishlist.length,
        following: user.following.length,
        followers: user.followers.length,
        recommendationsGiven,
        recommendationsReceived,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/users/:id/books/read ──────────────────────────────────────────
// Mark a book as read (or unmark it)
router.post('/:id/books/read', protect, async (req, res, next) => {
  try {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ error: 'bookId is required.' });

    const book = await Book.findById(bookId).select('_id');
    if (!book) return res.status(404).json({ error: 'Book not found.' });

    const user = await User.findById(req.user._id).select('booksRead');
    const hasRead = user.booksRead.includes(book._id);

    if (hasRead) {
      user.booksRead.pull(book._id);
    } else {
      user.booksRead.addToSet(book._id);
    }

    await user.save();
    res.json({ hasRead: !hasRead, booksReadCount: user.booksRead.length });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:username/followers ──────────────────────────────────────
router.get('/:username/followers', optionalAuth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const user = await User.findOne({ username: req.params.username, isActive: true })
      .select('followers')
      .populate({
        path: 'followers',
        select: 'username avatar bio followers',
        options: { skip: (page - 1) * limit, limit },
      });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ followers: user.followers });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:username/following ──────────────────────────────────────
router.get('/:username/following', optionalAuth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const user = await User.findOne({ username: req.params.username, isActive: true })
      .select('following')
      .populate({
        path: 'following',
        select: 'username avatar bio followers',
        options: { skip: (page - 1) * limit, limit },
      });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ following: user.following });
  } catch (err) {
    next(err);
  }
});

// ─── Admin: GET /api/users — list all (including inactive) ───────────────────
router.get(
  '/admin/all',
  protect,
  restrictTo('admin'),
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find({})
          .select('-password -resetPasswordToken -resetPasswordExpires')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments({}),
      ]);

      res.json({ users, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Admin: PATCH /api/users/:id/role ────────────────────────────────────────
router.patch(
  '/:id/role',
  protect,
  restrictTo('admin'),
  async (req, res, next) => {
    try {
      const { role } = req.body;
      if (!['user', 'moderator', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role.' });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, select: 'username email role' }
      );

      if (!user) return res.status(404).json({ error: 'User not found.' });
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
