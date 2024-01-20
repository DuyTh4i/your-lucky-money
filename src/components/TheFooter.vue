<template>
  <div id="footer">
    <div class="info">
      <a href="https://www.facebook.com/DuyTh4i" target="_blank">ThaiDD</a
      ><br />
      <span>dev.thaidd@gmail.com</span>
    </div>
  </div>
</template>

<style scoped>
#footer {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
.info {
  float: right;
  text-align: center;
  color: white;
  font-size: 0.7rem;
  font-family: 'something-strange';
}
a {
  color: white;
  text-decoration: none;
}
a:hover {
  color: rgb(233, 34, 74);
}
@font-face {
  font-family: something-strange;
  src: url("/font/sts.ttf");
}
</style>
