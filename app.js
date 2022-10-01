const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];
const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
];
const postViews = [];
const userPosts = {};

const http = require('http');
const server = http.createServer();

const httpRequestListener = (request, response) => {
  const { url, method } = request;
  
  if (method === 'POST') {
    // 유저 회원가입 하기
    if (url === '/users/signup') {
      let body = '';

      request.on('data', (data) => {
        body += data;
      });

      request.on('end', () => {
        const user = JSON.parse(body);
        users.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });
        response.writeHead(200, {'Content-Type' : 'application/json'});
        response.end(JSON.stringify({'users' : users}));
      });
    }
    // 게시글 등록하기
    if (url === '/posts/posting') {
      let body ='';

      request.on('data', (data) => {
        body += data;
      });

      request.on('end', () => {
        const post = JSON.parse(body);

        posts.push({
          id: post.id,
          title: post.title,
          content: post.content,
          userId: post.userId,
        });
        response.writeHead(200, {'Content-Type' : 'application/json'});
        response.end(JSON.stringify({'posts' : posts}));
      });
    }
    // 게시글 목록 조회하기
  } else if (method === 'GET') {
    // 게시글 목록 조회하기
    if (url === '/posts/get') {
      for(let i = 0; i < users.length; i++){
        postViews.push({
          userId: users[i].id,
          userName: users[i].name,
          postingId: posts[i].id,
          postingTitle: posts[i].title,
          postingContent: posts[i].content,
        });
      }
    response.writeHead(200, {'Content-Type' : 'application/json'});
    response.end(JSON.stringify({'data' : postViews}));    
    }
    // 유저와 게시글 조회하기
    if (url === '/users/postget') {
      let body = '';

      request.on('data', (data) => {
        body += data;
      });

      request.on('end', () => {
        const inputUser = JSON.parse(body);
        for (let i = 0; i < users.length; i++) {
          if (inputUser.id === users[i].id) {
            userPosts.userId =  users[i].id;
            userPosts.userName = users[i].name;
            userPosts.postings = [];
          }
          if (userPosts.userId === posts[i].userId) {
            userPosts.postings.push({
              postingId: posts[i].userId,
              postingName: posts[i].title,
              postingContent: posts[i].content,
            });
          }
        }
        response.writeHead(200, {'Content-Type' : 'application/json'});
        response.end(JSON.stringify({'data' : userPosts}));
      });
    }
  } else if (method === 'PATCH') {
    // 게시글 수정하기
    if (url === '/posts/update') {
      let body ='';

      request.on('data', (data) => {
        body += data;
      });

      request.on('end', () => {
        let postUpdate = {};
        const inputPost = JSON.parse(body);
        for (let i = 0; i < postViews.length; i++) {
          if (inputPost.id === postViews[i].postingId) {
            postViews[i].postingContent = inputPost.content;
            postUpdate = postViews[i];
          }
        }
        response.writeHead(200, {'Content-Type' : 'application/json'});
        response.end(JSON.stringify({'data': postUpdate}));
      });
    }
  } else if (method === 'DELETE') {
    // 게시물 삭제하기
    if (url === '/posts/delete') {
      let body ='';

      request.on('data', (data) => {
        body += data;
      });

      request.on('end', () => {
        const deletePost = JSON.parse(body);
        for (let i = 0; i < posts.length; i++) {
          if (deletePost.id === posts[i].id) {
            delete posts[i];
          }
        }
        response.writeHead(204, {'Content-Type' : 'application/json'});
        response.end(JSON.stringify({'message': 'postingDeleted'}));
      });
    }
  }
}

server.on('request', httpRequestListener);

const IP = '127.0.0.1';
const PORT = 8000;

server.listen(PORT, IP, function() {
  console.log(`Listening to request on ip ${IP} & port ${PORT}`);
})