<template>
  <div class="d-flex justify-content-center align-items-center login-container">
    <div class="title-top">
      <span class="title-top-text">频谱感知演示示范系统</span>
    </div>
    <form class="login-form text-center" @submit.prevent="handleSubmit">
      <div style="margin-bottom: 10px">
        <h1 class="mb-4 font-weight-light">
          {{ isForgotPassword ? "重置密码" : isRegister ? "注册" : "登录" }}
        </h1>
      </div>

      <!-- 登录表单 -->
      <div v-if="!isRegister && !isForgotPassword">
        <div class="form-group">
          <input
            v-model="username"
            type="text"
            class="form-control rounded-pill form-control-lg"
            placeholder="用户名"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="password"
            type="password"
            class="form-control rounded-pill form-control-lg"
            placeholder="密码"
            required
          />
        </div>

        <div class="forgot-link">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="remember"
              v-model="rememberMe"
            />
            <label for="remember" class="form-check-label">记住密码</label>
          </div>
          <div>
            <a
              href="#"
              class="text-muted"
              @click.prevent="toggleForm('forgotPassword')"
              >忘记密码?</a
            >
          </div>
        </div>

        <button type="submit" class="btn btn-custom btn-block rounded-pill">
          登录
        </button>

        <p class="mt-3 font-weight-normal">
          你还没有账号?
          <a
            href="#"
            @click.prevent="toggleForm('register')"
            class="text-primary"
          >
            <strong>注册</strong>
          </a>
        </p>
      </div>

      <!-- 注册表单 -->
      <div v-if="isRegister">
        <div class="form-group">
          <input
            v-model="username"
            type="text"
            class="form-control rounded-pill form-control-lg"
            placeholder="用户名"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="password"
            type="password"
            class="form-control rounded-pill form-control-lg"
            placeholder="密码"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control rounded-pill form-control-lg"
            placeholder="确认密码"
            required
          />
        </div>

        <button type="submit" class="btn btn-custom btn-block rounded-pill">
          注册
        </button>

        <p class="mt-3 font-weight-normal">
          已经有账号?
          <a href="#" @click.prevent="toggleForm('login')" class="text-primary">
            <strong>登录</strong>
          </a>
        </p>
      </div>

      <!-- 忘记密码表单 -->
      <div v-if="isForgotPassword">
        <div class="form-group">
          <input
            v-model="username"
            type="text"
            class="form-control rounded-pill form-control-lg"
            placeholder="输入用户名"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="newPassword"
            type="password"
            class="form-control rounded-pill form-control-lg"
            placeholder="输入新密码"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="confirmNewPassword"
            type="password"
            class="form-control rounded-pill form-control-lg"
            placeholder="确认新密码"
            required
          />
        </div>

        <button
          type="button"
          class="btn btn-custom btn-block rounded-pill"
          @click="resetPassword"
        >
          重置密码
        </button>

        <p class="mt-3 font-weight-normal">
          <a href="#" @click.prevent="toggleForm('login')" class="text-primary">
            <strong>返回登录</strong>
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      isRegister: false, // 控制注册界面显示
      isForgotPassword: false, // 控制忘记密码界面显示
      username: null,
      password: null,
      confirmPassword: null,
      username: localStorage.getItem("rememberedUsername") || null, // 自动填充用户名
      password: localStorage.getItem("rememberedPassword") || null, // 自动填充密码
      rememberMe: localStorage.getItem("rememberMe") === "true", // 检查是否记住密码
      newPassword: null,
      confirmNewPassword: null,
    };
  },
  methods: {
    toggleForm(mode) {
      if (mode === "login") {
        // 切换到登录界面
        this.isRegister = false;
        this.isForgotPassword = false;
      } else if (mode === "register") {
        // 切换到注册界面
        this.isRegister = true;
        this.isForgotPassword = false;
      } else if (mode === "forgotPassword") {
        // 切换到忘记密码界面
        this.isRegister = false;
        this.isForgotPassword = true;
      }
      this.clearFields();
    },
    clearFields() {
      // 清除表单输入内容
      this.username = null;
      this.password = null;
      this.confirmPassword = null;
      this.newPassword = null;
      this.confirmNewPassword = null;
    },
    handleSubmit() {
      if (this.isRegister) {
        // 注册逻辑
        const storedUsername = localStorage.getItem("username");
        if (this.username === storedUsername) {
          this.$message.error("用户名已存在，请使用其他用户名");
          return;
        }

        if (this.password !== this.confirmPassword) {
          this.$message.error("两次密码输入不一致");
          return;
        }

        localStorage.setItem("username", this.username);
        localStorage.setItem("password", this.password);
        this.$message.success("注册成功！请登录");
        this.toggleForm("login");
      } else if (!this.isForgotPassword) {
        // 登录逻辑
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");

        if (
          this.username === storedUsername &&
          this.password === storedPassword
        ) {
          if (this.rememberMe) {
            localStorage.setItem("rememberedUsername", this.username);
            localStorage.setItem("rememberedPassword", this.password);
            localStorage.setItem("rememberMe", true);
          } else {
            localStorage.removeItem("rememberedUsername");
            localStorage.removeItem("rememberedPassword");
            localStorage.removeItem("rememberMe");
          }
          localStorage.setItem("isLoggedIn", true);
          this.$router.push({ name: "tle" });
        } else {
          this.$message.error("用户名或密码错误");
        }
      }
    },
    resetPassword() {
      if (this.newPassword !== this.confirmNewPassword) {
        this.$message.error("两次新密码输入不一致");
        return;
      }

      const storedUsername = localStorage.getItem("username");
      if (this.username === storedUsername) {
        localStorage.setItem("password", this.newPassword);
        this.$message.success("密码重置成功！请登录");
        this.toggleForm("login");
      } else {
        this.$message.error("用户名不存在");
      }
    },
  },
};
</script>

<style scoped>
.title-top-text {
  color: #ffffff;
  font-size: 45px;
}
.title-top {
  position: relative;
  top: 20%;
}

.forgot-link {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 5px;
}
::v-deep .el-dialog {
  width: 25%;
  height: 40%;
  top: 150px;
  border-radius: 10px;
}
body {
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  background: #f5f5f5;
  color: #666;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: #eee;
  background-image: url("../../public/bg.png");
}

.login-form {
  text-align: center;
  margin: auto;
  width: 400px;
  padding: 20px;
  max-width: 100%;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

input.form-control {
  font-size: 16px;
  height: 20px;
  padding: 10px 20px;
  border-radius: 4px;
}

input::placeholder {
  color: #aaa;
}

.form-check-label {
  font-size: 14px;
  color: #666;
}

.text-muted {
  font-size: 14px;
}

.btn-custom {
  background: #723dbe;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  width: 60%;
  margin-bottom: 5px;
  border: none;
}

.btn-custom:hover {
  background: #54229d;
  color: #fff;
}

p {
  font-size: 14px;
  color: #666;
}

p a {
  color: #723dbe;
}

p a:hover {
  text-decoration: underline;
}
</style>
