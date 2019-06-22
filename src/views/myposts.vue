<template>
  <v-app>
    <v-content class="pt-5" style="background-color:#e9ebee;padding-left:25%;padding-right:25%">
      <v-dialog persistent flat v-model="nofeeds" width="500px">
        <v-card style="border-radius:8px;padding:16px">
          <v-layout column style="align-items: center;">
            <v-avatar size="50px">
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-avatar>
            <v-card-text>You have now no posts in your Home, would you like post something</v-card-text>
          </v-layout>
          <v-card-actions style="justify-content: center;">
            <v-btn @click="$router.push('/home')" small color="#3b5998">Post</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-layout v-if="feeds.length != 0 && reload" column>
        <v-card v-for="(feed,index) in feeds" :key="feed.index" class="mt-4 elevation-0">
          <v-layout class="pa-2">
            <v-layout>
              <v-avatar size="50px">
                <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
              </v-avatar>
              <v-layout class="pl-3" column>
                <v-card-text
                  class="pa-0"
                  style="color:#607aad;font-weight:bold;font-size:16px"
                >{{feed.userId[0].name}}</v-card-text>
                <v-layout style="align-items: center;">
                  <p>{{feedDate(feed.postDate)}}</p>
                  <img class="ml-1" src="../assets/world.svg" width="15px" height="15px">
                </v-layout>
              </v-layout>
              <v-btn @click="removePost(feed._id, index)" color="grey" icon flat>
                <v-icon>delete</v-icon>
              </v-btn>
            </v-layout>
          </v-layout>
          <v-layout>
            <v-card-text>{{feed.post}}</v-card-text>
          </v-layout>
          <v-divider class="mb-1"></v-divider>

          <v-layout class="mt-2 pl-3" row style="align-items: center;">
            <p @click="updateLikedUserInfo(feed.likedBy)">
              <u>{{likecount(feed)}} likes</u>
            </p>
            <p class="ml-2">{{commentCount(feed.comments)}} comments</p>
          </v-layout>
          <v-divider></v-divider>

          <v-layout class="mt-2 pa-2" row style="align-items: center;">
            <v-btn flat @click="likepost(feed, index)" row>
              <img
                class="ml-1"
                v-if="feed.viwed"
                src="../assets/like.svg"
                width="20px"
                height="20px"
              >
              <img class="ml-1" v-else src="../assets/unlike.svg" width="20px" height="20px">
              <p class="ml-1" link>Like</p>
            </v-btn>
            <v-btn flat @click="openCmt(index)">
              <img class="ml-1" src="../assets/comment.svg" width="20px" height="20px">
              <p class="ml-1">Comment</p>
            </v-btn>
          </v-layout>
          <v-divider></v-divider>
          <v-card v-if="feed.opencmt" class="pa-3">
            <v-layout column>
              <v-layout>
                <v-text-field
                  v-model="commentText"
                  prepend-icon="textsms"
                  placeholder="comment here...."
                ></v-text-field>
                <v-btn @click="savecmt(feed,index)" flat color="green">Send</v-btn>
              </v-layout>
              <div v-if="showcomments">
                <v-layout row v-for="(cmt) in feed.comments" :key="cmt.index">
                  <v-card-text
                    class="pa-1"
                    style="color:#1976d2d1;font-weight:bold;font-size:16px"
                  >{{cmt.username}}:</v-card-text>
                  <v-card-text class="pa-1">{{cmt.comment}}</v-card-text>
                </v-layout>
              </div>
            </v-layout>
          </v-card>
        </v-card>
      </v-layout>
    </v-content>
    <v-dialog width="200px" v-model="showlikeduserDialogue">
      <v-card>
        <v-card-text class="pa-1" v-for="user in showlikeduser" :key="user.index">{{user.name}}</v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Api from "@/libs/Api";
import global from "../libs/globalfunc";
import { userInfo } from "os";

export default {
  data() {
    return {
      reload: true,
      showcomments: true,
      postText: null,
      feeds: [],
      socket: this.$store.state.socket,
      newpost: false,
      userInfo: this.$store.state.user,
      commentText: null,
      showlikeduserDialogue: false,
      showlikeduser: null,

      nofeeds: false
    };
  },
  mounted() {
    console.log("reloading")
    this.getPosts();
    this.listenCommentUpdate();
    this.listenLikeUpdate();
    
  },
  methods: {
    getPosts() {
      var me = this;
      Api.getMyPosts(this.$store.state.user.userId)
        .then(res => {
          console.log("getMyPosts", res.data.data);
          me.feeds = me.savepost(res.data.data);
          console.log("saved posts", me.feeds);
          me.nofeeds = me.feeds.length == 0 ? true : false;
        })
        .catch(err => {
          console.log(err);
          alert("try again later");
        });
    },
    removePost(id, index) {
      try {
        var me = this;
        this.socket.emit("delete", id);
        me.feeds.splice(index, 1);
        me.nofeeds = me.feeds.length == 0 ? true : false;
      } catch (e) {
        console.log(e);
      }
    },

    openCmt(index) {
      this.reload = false;
      this.feeds[index].opencmt = !this.feeds[index].opencmt;
      this.reload = true;
    },
    feedDate(date) {
      return global.convertDate(date);
    },
    likecount(feed) {
      try {
        console.log("like count", feed);
        return feed.likedBy.length;
      } catch (e) {
        console.log(e);
      }
    },
    commentCount(comments) {
      return comments.length;
    },
    savepost(data) {
      var me = this;
      let formedArray = [];
      data.forEach(feed => {
        feed.opencmt = false;
        if (
          feed.likedBy.findIndex(each => {
            return each.likeduserId == me.userInfo.userId;
          }) >= 0
        ) {
          feed.viwed = true;
        } else {
          feed.viwed = false;
        }
        formedArray.push(feed);
      });
      return formedArray;
    },
    likepost(feed, index) {
      let me = this;
      if (feed.viwed) {
        me.unlikepost(feed, index);
      } else {
        Api.likepost(feed._id, me.userInfo.userId, me.userInfo.name)
          .then(res => {
            console.log(res);
            me.feeds[index].viwed = true;
            me.feeds[index].likedBy.push({ likeduserId: me.userInfo.userId });
            me.socket.emit("likestatus", {
              status: "like",
              postId: feed._id,
              userId: me.userInfo.userId,
              name: me.userInfo.name
            });
          })
          .catch(err => {
            console.log(err);
            alert("try again later");
          });
      }
    },
    unlikepost(feed, index) {
      let me = this;
      Api.unlikepost(feed._id, me.userInfo.userId)
        .then(res => {
          console.log(res);
          me.feeds[index].viwed = false;
          me.feeds[index].likedBy.pop();
          me.socket.emit("likestatus", {
            status: "unlike",
            postId: feed._id,
            userId: me.userInfo.userId
          });
        })
        .catch(err => {
          console.log(err);
          alert("try again later");
        });
    },
    savecmt(feed, index) {
      var me = this;
      Api.saveComment(
        feed._id,
        feed.userId[0]._id,
        me.commentText,
        me.userInfo.name
      )
        .then(res => {
          console.log(res.data.data);
          me.feeds[index].comments.unshift(res.data.data);
          me.showcomments = false;
          me.showcomments = true;
          me.socket.emit("commentstatus", res.data.data);
        })
        .catch(err => {
          console.log(err);
          alert("try again later");
        });
    },
    updateLikedUserInfo(users) {
      this.showlikeduserDialogue = true;
      this.showlikeduser = users;
    },

    //listeners


    listenCommentUpdate() {
      var me = this;
      this.socket.on("updatecomment", data => {
        if (me.feeds.length>0) {
          let index = me.feeds.findIndex(each => {
            return each._id == data.postId;
          });
          me.feeds[index].comments.unshift(data);
          me.showcomments = false;
          me.showcomments = true;
        }
      });
    },
    listenLikeUpdate() {
      let me = this;
      this.socket.on("updatelikestatus", (data) => {
        console.log("lisened", data)
        try {
          console.log("updatelikestatus", me.feeds);
          if (me.feeds.length > 0) {
            var index = me.feeds.findIndex(each => {
              return each._id == data.postId;
            });
            console.log("index", index, data, me.feeds)
            if (data.status == "like") {
              me.feeds[index].likedBy.push({
                likeduserId: data.userId,
                name: data.name
              });
            } else {
              var likeIndex = me.feeds[index].likedBy.findIndex(each => {
                return each.likeduserId == data.userId;
              });
              if (likeIndex >= 0) {
                me.feeds[index].likedBy.splice(likeIndex, 1);
              }
            }
          }
          // console.log("updated")
        } catch (e) {
          console.log(e);
        }
      });
      console.log("done");
    }
  }
};
</script>

<style>
.hometoolbar hr {
  border: 1px solid #4a69a7;
  height: 22px;
}
p {
  margin-bottom: 0px;
}
</style>