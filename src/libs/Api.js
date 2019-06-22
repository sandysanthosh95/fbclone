import axios from "../../node_modules/axios";

const URL = "http://localhost:9000/";
var timeoutSec = 1000 * 5;

export default {

  signup(data) {
    return axios({
      timeout: timeoutSec,
      url: URL + "users/save",
      method: "POST",
      data: data
    });
  },

  login(data) {
    return axios({
      timeout: timeoutSec,
      url: URL + "users/login",
      method: "POST",
      data: data
    });
  },

  getpost(userId) {
    return axios({
      timeout: timeoutSec,
      url: URL + "posts/getpost/" + userId,
      method: "GET",
    });
  },

  getMyPosts(userId) {
    return axios({
      timeout: timeoutSec,
      url: URL + "posts/getpostbyid/" + userId,
      method: "GET",
    })
  },

  createComment(data) {
    return axios({
      timeout: timeoutSec,
      url: URL + "comments/save/" + userId,
      method: "POST",
      data: data
    })
  },

  likepost(postId, userId,name) {
    let data = {
      postId: postId,
      userId: userId,
      name: name
    }
    return axios({
      timeout: timeoutSec,
      url: URL + "posts/likepost",
      method: "POST",
      data: data
    })
  },

  unlikepost(postId, userId) {
    let data = {
      postId: postId,
      userId: userId,
      name: name
    }
    return axios({
      timeout: timeoutSec,
      url: URL + "posts/unlikepost",
      method: "POST",
      data: data
    })
  },

  saveComment(postId, userId, comment,username) {
    let data = {
      postId: postId,
      userId: userId,
      comment: comment,
      username: username
    }
    return axios({
      timeout: timeoutSec,
      url: URL + "comment/save",
      method: "POST",
      data: data
    })
  }
};
