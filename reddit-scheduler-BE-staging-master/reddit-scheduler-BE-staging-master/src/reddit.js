const request = require('request');
const snoowrap = require('snoowrap');

const base64encode = str => {
  return new Buffer(str).toString('base64');
};

const getRedditAccessToken = (clientId, clientSecret, redirectUri, code) => {
  const qs = {
    grant_type:  'authorization_code',
    code,
    redirect_uri: redirectUri
  };
  const headers = {
    Authorization: 'Basic ' + base64encode(`${clientId}:${clientSecret}`),
  };

  return new Promise((resolve, reject) => {
    request.post({ uri: 'https://www.reddit.com/api/v1/access_token', 
      json: true, headers, qs }, (err, res, body) => {
      if(err)
        return reject(err);
      resolve(body);
    });
  });
};

const defaultRedditClient = app => {
  return {
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    clientId: app.get('redditClientId'),
    clientSecret: app.get('redditClientSecret')
  };
};

const getMyRedditAccountInfo = (app, refreshToken) => {
  const r = new snoowrap({...defaultRedditClient(app), refreshToken});
  return r.getMe();
};

const linkPostSubmit = async (app, post) => {
  
  const postResult = { _id: post._id || '', updates: {} };
  if(!post.account){
    postResult.updates.error = 'account not exists: ' + post.account;
    return postResult;
  }
  console.log("TEST:" + post.account.refreshToken);
  const r = new snoowrap({...defaultRedditClient(app), refreshToken: post.account.refreshToken});
  try {
    const submission = await r.submitLink({
      subredditName: post.subreddit,
      title: post.title,
      url: post.imageUrl,
      sendReplies: false
    });
    console.log(submission);
    postResult.updates.submissionName = submission.name;
    postResult.updates.posted = true;
  }
  catch(err){
    postResult.updates.error = err.message;
  }
  
  return postResult;
};

const cleanFullAccount = async (app, account) => {
  const r = new snoowrap({...defaultRedditClient(app), refreshToken: account.refreshToken});
  try {
    const result = await r.getUser(account.username).getSubmissions().then(submissions => { 
      for (let index = 0; index < submissions.length; index++) {
        const element = submissions[index];
        element.delete();
      }
    });

    const result2 = await r.getUser(account.username).getComments().then(comments => { 
      for (let index = 0; index < comments.length; index++) {
        const element = comments[index];
        element.delete();
      }
    });

    return "Succes";
  }
  catch(err){
    // IF 400 ACC PROBABLY BANNED OR REMOVED
    // console.log(err.message);

    return "Failed";
  }
}

const deletedPostSubmit = async (app, post) => {
  const postResult = { _id: post._id || '', updates: {} };
  if(!post.account){
    postResult.updates.error = 'account not exists: ' + post.account;
    return postResult;
  }
  const r = new snoowrap({...defaultRedditClient(app), refreshToken: post.account.refreshToken});
  try {
    const name = await r.getSubmission(post.submissionName).author.name;
    const indexable = await r.getSubmission(post.submissionName).is_robot_indexable;

    const upvotes = await r.getSubmission(post.submissionName).ups;
    const downvotes = await r.getSubmission(post.submissionName).downs;
    const votes = upvotes - downvotes;

    const comments = await r.getSubmission(post.submissionName).comments.length;
    console.log("votes: " + votes);
    console.log("comments: " + comments);
    postResult.updates.upvotes = votes;
    postResult.updates.comments = comments;
    
    if (indexable == false) {
      postResult.updates.deleted = true;
    }
    if(name == "[deleted]" || name == "[removed]") {
      postResult.updates.deleted = true;
    }
  }
  catch(err){
    postResult.updates.error = err.message;
  }
  
  return postResult;
};

module.exports = {
  getRedditAccessToken,
  getMyRedditAccountInfo,
  linkPostSubmit,
  cleanFullAccount,
  deletedPostSubmit
}
