var router = require('express').Router();

router.use('/api', require('./api'));

module.exports = router;

// 验证信息，也就是当前登录用户的身份。
// API的端点可以分为三类：

// 不需要验证信息，比如上面提到的POST /api/users/login和POST /api/users

// 需要验证信息，比如返回当前用户的GET /api/user或者删除某篇博文的DELETE /api/articles/:slug

// 验证信息可有可无，比如返回某篇博文的评论列表的GET /api/articles/:slug/comments