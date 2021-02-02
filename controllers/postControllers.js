const Post = require('../Models/postModels');
const User = require('../Models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createPost = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  // 1) check if anything irrelevent present or not like password
  if (
    req.body.password ||
    req.body.passwordConfirm ||
    req.body.email
  ) {
    return next(
      new AppError(
        'This route can only upload posts if you wish to change the password then please go to /changepassword route',
        400
      )
    );
  }

  // 2) filter out data that are not allowed to be there

  if (req.body.name && req.body.photo && req.user.id) {
    const post = await Post.create({
      name: req.body.name,
      postedBy: req.user.id,
      photo: req.body.photo,
    });

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } else {
    return next(new AppError('Please fill all fields', 400));
  }
});




exports.deletePost = catchAsync(async (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});


exports.getMyPosts = catchAsync(async (req, res, next) => {
  const myPosts = await Post.find({ postedBy: req.user.id });

  if (!myPosts) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    result: myPosts.length,
    data: {
      name: req.user.name,
      myPosts,
    },
  });
});
